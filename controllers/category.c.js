const db = require('../models');
const bcrypt = require('bcrypt');
const e = require('express');
const { Op, UniqueConstraintError } = require('sequelize');
const cloudinary = require('../config/cloudinary');
const toDataUri = require('../helpers/dataUriConverter');
const Category = db.Category;
const Product = db.Product;
const Image = db.Image;

module.exports = {
    // [GET] /category
    showAll: async (req, res, next) => {
        try {
            let { page, size, sortBy, sortDir, name, createdAtFrom, createdAtTo, updatedAtFrom, updatedAtTo } = req.query;
            page = page || 1;
            size = size || 10;
            sortBy = (sortBy || sortBy === 'productsNum') || 'id';
            sortDir = sortDir || 'asc';
            let filters = {};

            // filter
            if (name) {
                filters.name = {
                    [Op.like]: `%${name}%`
                };
            }
            if (createdAtFrom || createdAtTo) {
                createdAtFrom = new Date(createdAtFrom);
                createdAtTo = new Date(createdAtTo);
                createdAtFrom.setHours(0, 0, 0, 0);
                createdAtTo.setHours(23, 59, 59, 999);
                filters.createdAt = {
                    [Op.between]: [createdAtFrom || '1970-01-01', createdAtTo || '9999-12-31']
                }
            }
            if (updatedAtFrom || updatedAtTo) {
                updatedAtFrom = new Date(updatedAtFrom);
                updatedAtTo = new Date(updatedAtTo);
                updatedAtFrom.setHours(0, 0, 0, 0);
                updatedAtTo.setHours(23, 59, 59, 999);
                filters.updatedAt = {
                    [Op.between]: [updatedAtFrom || '1970-01-01', updatedAtTo || '9999-12-31']
                }
            }

            // get all categories
            const categories = await Category.findAll({
                where: filters,
                order: [
                    [sortBy, sortDir]
                ],
                offset: (page - 1) * size,
                limit: size
            });

            for (let i = 0; i < categories.length; ++i) {
                // get number of products
                const productsNum = await Product.count({
                    where: {
                        categoryId: categories[i].id
                    }
                });
                const productsUrl = `/product?categoryId=${categories[i].id}`;
                const createdAt = new Date(categories[i].createdAt);
                const updatedAt = new Date(categories[i].updatedAt);
                const formattedCreatedAt = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes()}`;
                const formattedUpdatedAt = `${updatedAt.getDate()}-${updatedAt.getMonth() + 1}-${updatedAt.getFullYear()} ${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
                categories[i] = categories[i].dataValues;
                categories[i].products = {
                    number: productsNum,
                    url: productsUrl
                }
                categories[i].formattedCreatedAt = formattedCreatedAt;
                categories[i].formattedUpdatedAt = formattedUpdatedAt;
            }

            if(sortBy === 'productsNum') {
                categories.sort((a, b) => {
                    if(sortDir === 'asc') {
                        return a.productsNum - b.productsNum;
                    } else {
                        return b.productsNum - a.productsNum;
                    }
                });
            }

            const urlParams = new URLSearchParams(req.query);
            urlParams.delete('page');
            res.render('category/list-category', {
                active: { Categories: true },
                categories,
                total: categories.length,
                page,
                queryObj: req.query,
                urlParams: urlParams.toString()
            });
        } catch (err) {
            next(err);
        }
    },

    // [GET] /category/create-new
    getCreateCategory: async (req, res, next) => {
        try {
            res.render('category/editable-category', {
                active: { Categories: true },
                editable: false
            });
        } catch (err) {
            next(err);
        }
    },

    // [POST] /category
    createCategory: async (req, res, next) => {
        try {
            const { name } = req.body;
            const category = await Category.create({
                name
            });
            res.redirect('/category');
        } catch (err) {
            next(err);
        }
    },

    // [GET] /category/edit/:id
    getEditCategory: async (req, res, next) => {
        try {
            const id = req.params.id;
            let category = await Category.findByPk(id);
            category = category.dataValues;
            res.render('category/editable-category', {
                active: { Categories: true },
                editable: true,
                category
            });
        } catch (err) {
            next(err);
        }
    },

    // [POST] /category/edit/:id
    postEditCategory: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { name } = req.body;
            const category = await Category.update({
                name
            }, {
                where: {
                    id
                }
            });
            res.redirect('/category');
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                res.render('category/editable-category', {
                    active: { Categories: true },
                    editable: true,
                    category: req.body,
                    message: 'Category name already exists'
                });
            } else {
                next(err);
            }
        }
    },

    // [POST] /category/:id
    handleSingleItem: async (req, res, next) => {
        try {
            const id = req.params.id;
            const action = req.body.action;
            if (action === 'delete') {
                let productIds = await Product.findAll({
                    where: {
                        categoryId: id
                    },
                    attributes: ['id']
                });
                productIds = productIds.map(product => product.dataValues.id);
                const images = await Image.findAll({
                    where: {
                        productId: productIds
                    }
                });
                for(let i = 0; i < images.length; ++i) {
                    await cloudinary.uploader.destroy(images[i].publicId);
                }
                await Image.destroy({
                    where: {
                        productId: productIds
                    }
                });
                await Product.destroy({
                    where: {
                        categoryId: id
                    }
                });
                await Category.destroy({
                    where: {
                        id
                    }
                });
            }
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    },

    // [POST] /:role/multiselect-handle
    handleMultiItems: async (req, res, next) => {
        try {
            const { action, selectedItems } = req.body;
            if (action === 'delete') {
                let productIds = await Product.findAll({
                    where: {
                        categoryId: selectedItems
                    },
                    attributes: ['id']
                });
                productIds = productIds.map(product => product.dataValues.id);
                const images = await Image.findAll({
                    where: {
                        productId: productIds
                    }
                });
                for (let i = 0; i < images.length; ++i) {
                    await cloudinary.uploader.destroy(images[i].public_id);
                }
                await Image.destroy({
                    where: {
                        productId: productIds
                    }
                });
                await Product.destroy({
                    where: {
                        categoryId: selectedItems
                    }
                });
                await Category.destroy({
                    where: {
                        id: selectedItems
                    }
                });
            }
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }
}