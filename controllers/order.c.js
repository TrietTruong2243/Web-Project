const db = require('../models');
const { Op, UniqueConstraintError } = require('sequelize');
const OrderItem = db.OrderItem;
const Order = db.Order;
const User = db.User;
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
const CurrencyOptions = {
    style: "currency",
    currency: "VND"
}

module.exports = {
    // [GET] /order
    showAll: async (req, res, next) => {
            try {
                let { id, page, size, sortBy, sortDir, status, createdAtFrom, createdAtTo, updatedAtFrom, updatedAtTo } = req.query;
                page = page || 1;
                size = size || 10;
                sortBy = sortBy || 'id';
                sortDir = sortDir || 'asc';
                let filters = {};
                
                if(id){
                    filters.id = id;
                }
                if (status) {
                    filters.status = status;
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

                const orders = await Order.findAll({
                    where: filters,
                    include: [
                        {
                            model: User,
                            as: 'user'
                        }
                    ],
                    order: [
                        [sortBy, sortDir]
                    ],
                    limit: size,
                    offset: (page - 1) * size,
                });

                for (let i = 0; i < orders.length; ++i) {
                    orders[i] = orders[i].dataValues;
                    orders[i].formattedCreatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(orders[i].createdAt);
                    orders[i].formattedUpdatedAt = new Intl.DateTimeFormat('vi', DateOptions).format(orders[i].updatedAt);
                    orders[i].user = orders[i].user.dataValues;
                    const orderItems = await OrderItem.findAll({
                        where: {
                            orderId: orders[i].id
                        },
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    });
                    orders[i].totalAmount = orderItems.reduce((total, item) => {
                        return total + item.quantity * item.product.price;
                    }, 0);
                    orders[i].formattedTotalAmount = new Intl.NumberFormat('vi', CurrencyOptions).format(orders[i].totalAmount);
                }

                const total = await Order.count({
                    where: filters
                });

                let urlParams = (new URLSearchParams(req.query));
                urlParams.delete('page');

                res.render('order/list-order', {
                    active: { Orders: true },
                    orders,
                    total,
                    page,
                    queryObj: req.query,
                    urlParams: urlParams.toString()
                });
            } catch (err) {
                next(err);
            }
    },

    // [GET] /order/create-new
    getCreateOrder: async (req, res, next) => {
        try {
            res.render('order/editable-order', {
                active: { Orders: true },
                editable: false,
            });
        } catch (err) {
            next(err);
        }
    },

    // [GET] /order/edit/:id
    getEditOrder: async (req, res, next) => {
        try {
            const id = req.params.id;
            let order = await Order.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: OrderItem,
                        as: 'orderItems',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                include: [
                                    {
                                        model: Image,
                                        as: 'mainImage',
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            });

            // clean data
            order = order.dataValues;
            order.user = order.user.dataValues;
            order.orderItems = order.orderItems.map(item => {
                item = item.dataValues;
                item.product = item.product.dataValues;
                item.product.formattedPrice = new Intl.NumberFormat('vi', CurrencyOptions).format(item.product.price);
                item.formattedAmount = new Intl.NumberFormat('vi', CurrencyOptions).format(item.quantity * item.product.price);
                if(item.product.mainImage) item.product.mainImage = item.product.mainImage.dataValues;
                return item;
            });
            order.totalAmount = order.orderItems.reduce((total, item) => {
                return total + item.quantity * item.product.price;
            }, 0);
            order.formattedTotalAmount = new Intl.NumberFormat('vi', CurrencyOptions).format(order.totalAmount);
            
            res.render('order/editable-order', {
                active: { Orders: true },
                editable: true,
                order
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [POST] /order/:id
    handleSingleItem: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { action } = req.body;
            if (action === 'delete') {
                await Order.destroy({
                    where: {
                        id
                    }
                });
            }
            
            res.redirect('back');
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [POST] /order/multiselect-handle
    handleMultiItems: async (req, res, next) => {
        try {
            const { action, selectedItems } = req.body;
            if (action === 'delete') {
                await Order.destroy({
                    where:{
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
    // [GET] /order/api/data/:id
    getOrderData: async (req, res, next) => {
        try{
            const id = req.params.id;
            let order = await Order.findOne({
                where:{
                    id,
                }, 
                include: [
                    {
                        model: OrderItem,
                        as: 'orderItems',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                include: [
                                    {
                                        model: Image,
                                        as: 'mainImage',
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            });
            order = order.dataValues;
            // clean data
            for(let i = 0; i < order.orderItems.length; ++i){
                order.orderItems[i] = order.orderItems[i].dataValues;
                order.orderItems[i].product = order.orderItems[i].product.dataValues;
                if(order.orderItems[i].product.mainImage) 
                    order.orderItems[i].product.mainImage = order.orderItems[i].product.mainImage.dataValues;
            }
            order.totalAmount = order.orderItems.reduce((total, item) => {
                return total + item.quantity * item.product.price;
            }, 0);

            res.status(200).json({
                data: order
            });
        } catch(err){
            console.log(err);
            next(err);
        }
    },

    // [POST] /order/api/create-new
    createNewOrder: async (req, res, next) => {
        try{
            const { customername, productIds, quantities } = req.body;
            // check user
            const user = await User.findOne({
                where:{
                    username: customername
                }
            });
            if(!user){
                res.status(400).json({
                    message: `User ${customername} does not exist.`
                });
            }

            const order = await Order.create({
                userId: user.id,
            });

            // check quantity of all products
            for(let i = 0; i < productIds.length; ++i){
                const product = await Product.findOne({
                    where:{
                        id: productIds[i]
                    }
                });
                if(product){
                    if(product.quantity < quantities[i]){
                        res.status(400).json({
                            message: `The quantity of product ${product.name} is not enough`
                        });
                    }
                }
            }

            // create order items
            for(let i = 0; i < productIds.length; ++i){
                await OrderItem.create({
                    orderId: order.id,
                    productId: productIds[i],
                    quantity: quantities[i]
                });
                const product = await Product.findOne({
                    where:{
                        id: productIds[i]
                    }
                });
                await Product.update({
                    quantity: product.quantity - quantities[i]
                }, {
                    where:{
                        id: productIds[i]
                    }
                });
            }
            
            res.status(200).json({
                success: true
            });
        } catch(err){
            console.log(err);
            next(err);
        }
    },

    // [PATCH] /order/api/change-status/:id
    changeStatus: async (req, res, next) => {
        try{
            const id = req.params.id;
            const { status } = req.body;
            await Order.update({
                status
            }, {
                where:{
                    id
                }
            });
            res.status(200).json({
                data: status
            });
        } catch(err){
            console.log(err);
            next(err);
        }
    },

    // [PATCH] /order/api/edit/:id
    editOrder: async (req, res, next) => {
        try{
            const id = req.params.id;
            const { customername, productIds, quantities } = req.body;

            const order = await Order.findOne({
                where: {
                    id
                }
            });
            
            // delete old order items and restore quantity of products
            const oldOrderItems = await OrderItem.findAll({
                where:{
                    orderId: id
                }
            });
            for(let i = 0; i < oldOrderItems.length; ++i){
                const product = await Product.findOne({
                    where:{
                        id: oldOrderItems[i].productId
                    }
                });
                await Product.update({
                    quantity: product.quantity + oldOrderItems[i].quantity
                }, {
                    where:{
                        id: oldOrderItems[i].productId
                    }
                });
            }
            await OrderItem.destroy({
                where:{
                    orderId: id
                }
            });

            // check quantity of all products
            for(let i = 0; i < productIds.length; ++i){
                const product = await Product.findOne({
                    where:{
                        id: productIds[i]
                    }
                });
                if(product){
                    if(product.quantity < quantities[i]){
                        res.status(400).json({
                            message: `The quantity of product ${product.name} is not enough`
                        });
                    }
                }
            }

            // create new order items
            for(let i = 0; i < productIds.length; ++i){
                await OrderItem.create({
                    orderId: id,
                    productId: productIds[i],
                    quantity: quantities[i]
                });
                const product = await Product.findOne({
                    where:{
                        id: productIds[i]
                    }
                });
                await Product.update({
                    quantity: product.quantity - quantities[i]
                }, {
                    where:{
                        id: productIds[i]
                    }
                });
            }

            res.status(200).json({
                success: true
            });
        } catch(err){
            console.log(err);
            next(err);
        }
    }

}