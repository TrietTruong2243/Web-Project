const db = require('../models');
const bcrypt = require('bcrypt');
const { Op, UniqueConstraintError } = require('sequelize');
const cloudinary = require('../config/cloudinary');
const toDataUri = require('../helpers/dataUriConverter');
const { parse } = require('dotenv');
const Product = db.Product;
const Category = db.Category;
const User = db.User;
const Image = db.Image;

module.exports = {
    // [GET] /product
    showAll: async (req, res, next) => {
        try {
            let { page, size, sortBy, sortDir, name, category, quantityFrom, quantityTo, priceFrom, priceTo, createdAtFrom, createdAtTo, updatedAtFrom, updatedAtTo } = req.query;
            page = page || 1;
            size = size || 10;
            sortBy = sortBy || 'id';
            sortDir = sortDir || 'asc';
            let filters = {};

            // filter
            if (name) {
                filters.name = {
                    [Op.like]: `%${name}%`
                };
            }
            if (category) {
                filters.categoryId = category;
            }
            if (quantityFrom || quantityTo) {
                filters.quantity = {
                    [Op.between]: [quantityFrom || 0, quantityTo || 999999999]
                }
            }
            if (priceFrom || priceTo) {
                filters.price = {
                    [Op.between]: [priceFrom || 0, priceTo || 999999999]
                }
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

            const categories = await Category.findAll();
            for (let i = 0; i < categories.length; ++i) {
                categories[i] = categories[i].dataValues;
            }

            const products = await Product.findAll({
                where: filters,
                order: [
                    [sortBy, sortDir]
                ],
                limit: size,
                offset: (page - 1) * size
            });
            for (let i = 0; i < products.length; ++i) {
                let images = await Image.findAll({
                    where: {
                        productId: products[i].id
                    }
                });
                images = images.map(image => image.dataValues);

                const mainImage = images.find(image => image.id === products[i].mainImageId);
                const createdAt = new Date(products[i].createdAt);
                const updatedAt = new Date(products[i].updatedAt);
                const formattedCreatedAt = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes()}`;
                const formattedUpdatedAt = `${updatedAt.getDate()}-${updatedAt.getMonth() + 1}-${updatedAt.getFullYear()} ${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
                products[i] = products[i].dataValues;
                products[i].images = images;
                products[i].mainImage = mainImage;
                products[i].categoryName = categories.find(category => category.id === products[i].categoryId).name;
                products[i].categoryUrl = `/category?name=${products[i].categoryName}`;
                products[i].formattedCreatedAt = formattedCreatedAt;
                products[i].formattedUpdatedAt = formattedUpdatedAt;
                console.log(products[i]);
            }

            let urlParams = (new URLSearchParams(req.query));
            urlParams.delete('page');

            res.render('product/list-product', {
                active: { Products: true },
                products,
                categories,
                total: products.length,
                page,
                urlParams: urlParams.toString(),
                queryObj: req.query
            });
        } catch (err) {
            next(err);
        }
    },

    // [GET] /product/create-new
    getCreateProduct: async (req, res, next) => {
        try {
            let categories = await Category.findAll();
            categories = categories.map(category => category.dataValues);
            console.log(categories);
            res.render('product/editable-product', {
                active: { Products: true },
                editable: false,
                categories
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [POST] /product
    createProduct: async (req, res, next) => {
        try {
            const { name, description, price, quantity, category } = req.body;
            const images = req.files;
            const product = await Product.create({
                name,
                price,
                quantity,
                categoryId: category,
                description,
            });

            if (images) {
                console.log(images);
                for (let i = 0; i < images.length; ++i) {
                    const image = await cloudinary.uploader.upload(toDataUri(images[i]), {
                        folder: 'HCMUS-Ecommerce/products'
                    });
                    const newImage = await Image.create({
                        url: image.url,
                        public_id: image.public_id,
                        productId: product.id
                    });

                    if(i === 0) {
                        await Product.update({
                            mainImageId: newImage.id
                        }, {
                            where: {
                                id: product.id
                            }
                        });
                    }
                }
            }

            res.redirect('/product');
        } catch (err) {
            next(err);
        }
    },

    // [GET] /product/edit/:id
    getEditProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            let product = await Product.findOne({
                where: {
                    id
                }
            });
            product = product.dataValues;

            let categories = await Category.findAll();
            categories = categories.map(category => category.dataValues);

            const images = await Image.findAll({
                where: {
                    productId: id
                }
            });
            product.images = images.map(image => image.dataValues);
            res.render('product/editable-product', {
                active: { Products: true },
                editable: true,
                product,
                categories
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [POST] /product/edit/:id
    postEditProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { name, description, price, quantity, category, removeIds, mainId } = req.body;
            const images = req.files;

            const product = await Product.update({
                name,
                price,
                quantity,
                categoryId: category,
                description,
            }, {
                where: {
                    id
                }
            });

            const removeIdsArr = removeIds.split(',');
            for (let i = 0; i < removeIdsArr.length; ++i) {
                removeIdsArr[i] = parseInt(removeIdsArr[i]);
            }
            console.log(removeIdsArr);
            console.log(removeIdsArr[0]);
            if (removeIdsArr.length > 0 && !isNaN(removeIdsArr[0])) {
                console.log('delete images');
                const images = await Image.findAll({
                    where: {
                        id: removeIdsArr
                    }
                });
                ;
                for(let i = 0; i < images.length; ++i) {
                    await cloudinary.uploader.destroy(images[i].public_id);
                }
                await Image.destroy({
                    where: {
                        id: removeIdsArr
                    }
                });
            }

            if (images) {
                for (let i = 0; i < images.length; ++i) {
                    const image = await cloudinary.uploader.upload(toDataUri(images[i]), {
                        folder: 'HCMUS-Ecommerce/products'
                    });
                    await Image.create({
                        url: image.url,
                        public_id: image.public_id,
                        productId: id
                    });
                }
            }

            if (mainId !== '') {
                await Product.update({
                    mainImageId: mainId
                }, {
                    where: {
                        id
                    }
                });
            } else {
                // set main image for the first image
                const image = await Image.findOne({
                    where: {
                        productId: id
                    }
                });
                console.log(image);
                if (image !== null){
                    await Product.update({
                        mainImageId: image.id
                    }, {
                        where: {
                            id
                        }
                    });
                }
            }

            res.redirect('/product');
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [POST] /product/:id
    handleSingleItem: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { action } = req.body;
            if (action === 'delete') {
                // delete images
                const images = await Image.findAll({
                    where: {
                        productId: id
                    }
                });
                for (let i = 0; i < images.length; ++i) {
                    await cloudinary.uploader.destroy(images[i].public_id);
                }
                await Image.destroy({
                    where: {
                        productId: id
                    }
                });
                await Product.destroy({
                    where: {
                        id
                    }
                });
            }
            // else if (action === 'changeToAvailable') {
            //     const product = await Product.update({ status: 'available' }, {
            //         where: {
            //             id
            //         }
            //     });
            // } else if (action === 'changeToUnavailable') {
            //     const product = await Product.update({ status: 'unavailable' }, {
            //         where: {
            //             id
            //         }
            //     });
            // }
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    },

    // [POST] /product/multiselect-handle
    handleMultiItems: async (req, res, next) => {
        try {
            const { action, selectedItems } = req.body;
            if (action === 'delete') {
                // delete images
                const images = await Image.findAll({
                    where: {
                        productId: selectedItems
                    }
                });
                for (let i = 0; i < images.length; ++i) {
                    await cloudinary.uploader.destroy(images[i].public_id);
                }
                await Image.destroy({
                    where: {
                        productId: selectedItems
                    }
                });
                await Product.destroy({
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