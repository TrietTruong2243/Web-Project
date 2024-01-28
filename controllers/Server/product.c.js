const db = require('../../models/Server');
const { Op, UniqueConstraintError } = require('sequelize');
const cloudinary = require('../../config/cloudinary');
const toDataUri = require('../../helpers/dataUriConverter');
const Product = db.Product;
const Category = db.Category;
const Image = db.Image;
const DateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}
const CurrencyOptions = {
    style: 'currency',
    currency: 'VND'
}

module.exports = {
    // [GET] /product
    showAll: async (req, res, next) => {
        try {
            let { id, page, size, sortBy, sortDir, name, category, quantityFrom, quantityTo, priceFrom, priceTo, createdAtFrom, createdAtTo, updatedAtFrom, updatedAtTo } = req.query;
            page = page || 1;
            size = size || 10;
            sortBy = sortBy || 'id';
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
                if(createdAtFrom){
                    createdAtFrom = new Date(createdAtFrom);
                    createdAtFrom.setHours(0, 0, 0, 0);
                } else createdAtFrom = '1970-01-01';
                if(createdAtTo){
                    createdAtTo = new Date(createdAtTo);
                    createdAtTo.setHours(23, 59, 59, 999);
                } else createdAtTo = '9999-12-31';
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

            const categories = await Category.findAll();
            for (let i = 0; i < categories.length; ++i) {
                categories[i] = categories[i].dataValues;
            }

            const products = await Product.findAll({
                where: filters,
                include: [
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: Image,
                        as: 'mainImage'
                    },
                    {
                        model: Image,
                        as: 'images'
                    }
                ],
                order: [
                    [sortBy, sortDir]
                ],
                limit: size,
                offset: (page - 1) * size
            });
            for (let i = 0; i < products.length; ++i) {
                products[i] = products[i].dataValues;
                products[i].category = products[i].category.dataValues;
                products[i].images = products[i].images.map(image => image.dataValues);
                if(products[i].mainImage) products[i].mainImage = products[i].mainImage.dataValues;
                products[i].formattedCreatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(products[i].createdAt);
                products[i].formattedUpdatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(products[i].updatedAt);
                products[i].formattedPrice = new Intl.NumberFormat('vi', CurrencyOptions).format(products[i].price);
            }

            const total = await Product.count({
                where: filters
            });

            let urlParams = (new URLSearchParams(req.query));
            urlParams.delete('page');

            res.render('product/list-product', {
                active: { Products: true },
                products,
                categories,
                total,
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
                price: isNaN(parseInt(price)) ? 0 : parseInt(price),
                quantity: isNaN(parseInt(quantity)) ? 0 : parseInt(quantity),
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

                    if (i === 0) {
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

            res.redirect('/admin/product');
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
                price: isNaN(parseInt(price)) ? 0 : parseInt(price),
                quantity: isNaN(parseInt(quantity)) ? 0 : parseInt(quantity),
                categoryId: category,
                description,
            }, {
                where: {
                    id
                }
            });

            if(removeIds) {
                const removeIdsArr = removeIds.split(',');
                for (let i = 0; i < removeIdsArr.length; ++i) {
                    removeIdsArr[i] = parseInt(removeIdsArr[i]);
                }

                if (removeIdsArr.length > 0 && !isNaN(removeIdsArr[0])) {
                    console.log('delete images');
                    const images = await Image.findAll({
                        where: {
                            id: removeIdsArr
                        }
                    });
                    for (let i = 0; i < images.length; ++i) {
                        await cloudinary.uploader.destroy(images[i].public_id);
                    }
                    await Image.destroy({
                        where: {
                            id: removeIdsArr
                        }
                    });
                }
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

            if (mainId && !isNaN(parseInt(mainId))) {
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
                if (image) {
                    await Product.update({
                        mainImageId: image.id
                    }, {
                        where: {
                            id
                        }
                    });
                }
            }

            res.redirect('/admin/product');
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
    },

    // API
    // [GET] /product/api/data/:id
    getProductData: async (req, res, next) => {
        try {
            const id = req.params.id;
            const product = await Product.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: Image,
                        as: 'images'
                    },
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: Image,
                        as: 'mainImage'
                    }
                ]
            });
            product = product.dataValues;
            // format date
            product.formattedCreatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(product.createdAt);
            product.formattedUpdatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(product.updatedAt);
            // format price
            product.formattedPrice = new Intl.NumberFormat('vi', CurrencyOptions).format(product.price);
            // clean data
            if(product.images.length > 0) product.images = product.images.map(image => image.dataValues);
            product.category = product.category.dataValues;
            if(product.mainImage) product.mainImage = product.mainImage.dataValues;

            res.json(product);
        } catch (err) {
            next(err);
        }
    },

    // [GET] /product/api/data/
    getAllProducts: async (req, res, next) => {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Image,
                        as: 'images'
                    },
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: Image,
                        as: 'mainImage'
                    }
                ]
            });

            for (let i = 0; i < products.length; ++i) {
                products[i] = products[i].dataValues;
                // clean data
                if(products[i].images.length > 0) products[i].images = products[i].images.map(image => image.dataValues);
                products[i].category = products[i].category.dataValues;
                if(products[i].mainImage) products[i].mainImage = products[i].mainImage.dataValues; 
            }

            res.json(products);
        } catch (err) {
            next(err);
        }
    }
}