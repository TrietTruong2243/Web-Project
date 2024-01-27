const db = require('../models');
const bcrypt = require('bcrypt');
const e = require('express');
const { Op, UniqueConstraintError } = require('sequelize');
const cloudinary = require('../config/cloudinary');
const Category = db.Category;
const Product = db.Product;
const Image = db.Image;
const DateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

module.exports = {
    // [GET] /category
    showAll: async (req, res, next) => {
        try {
            let { page, size, sortBy, sortDir, id, name, createdAtFrom, createdAtTo, updatedAtFrom, updatedAtTo } = req.query;
            page = page || 1;
            size = size || 10;
            sortBy = (sortBy || sortBy === 'productsNum') || 'id';
            sortDir = sortDir || 'asc';
            let filters = {};

            // filter
            if (id) {
                filters.id = id;
            }
            if (name) {
                filters.name = {
                    [Op.like]: `%${name}%`
                };
            }
            if (createdAtFrom || createdAtTo) {
                if(createdAtFrom){
                    createdAtFrom = new Date(createdAtFrom);
                    createdAtFrom.setHours(0, 0, 0, 0);
                }
                else createdAtFrom = '1970-01-01'
                if(createdAtTo){
                    createdAtTo = new Date(createdAtTo);
                    createdAtTo.setHours(23, 59, 59, 999);
                }
                else createdAtTo = '9999-12-31'
                filters.createdAt = {
                    [Op.between]: [createdAtFrom, createdAtTo]
                }
            }
            if (updatedAtFrom || updatedAtTo) {
                if(updatedAtFrom){
                    updatedAtFrom = new Date(updatedAtFrom);
                    updatedAtFrom.setHours(0, 0, 0, 0);
                } else updatedAtFrom = '1970-01-01';
                if(updatedAtTo){
                    updatedAtTo = new Date(updatedAtTo);
                    updatedAtTo.setHours(23, 59, 59, 999);
                } else updatedAtTo = '9999-12-31';

                filters.updatedAt = {
                    [Op.between]: [updatedAtFrom , updatedAtTo]
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
                const productsUrl = `/product?category=${categories[i].id}`;
                
                categories[i] = categories[i].dataValues;
                categories[i].products = {
                    number: productsNum,
                    url: productsUrl
                }
                categories[i].formattedCreatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(categories[i].createdAt);
                categories[i].formattedUpdatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(categories[i].updatedAt);
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

            const total = await Category.count({
                where: filters
            });

            const urlParams = new URLSearchParams(req.query);
            urlParams.delete('page');

            res.render('category/list-category', {
                active: { Categories: true },
                categories,
                total,
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
            if(err instanceof UniqueConstraintError) {
                res.render('category/editable-category', {
                    active: { Categories: true },
                    editable: false,
                    category: req.body,
                    message: 'Category name already exists'
                });
            } else next(err);
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

    // [POST] /category/multiselect-handle
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