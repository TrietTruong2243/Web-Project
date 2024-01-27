const db = require('../models');
const { Op, UniqueConstraintError } = require('sequelize');
const sequelize = db.sequelize;
const Product = db.Product;
const Category = db.Category;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Image = db.Image;
const DateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

const getSaleInPeriod = async (from, to) => {
    const sale = await OrderItem.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.literal('"OrderItems".quantity * product.price')), 'sale']
        ],
        include: [
            {
                model: Order,
                as: 'order',
                attributes: [],
                where: {
                    status: 'completed',
                    createdAt: {
                        [Op.between]: [from, to]
                    }
                }
            },
            {
                model: Product,
                as: 'product',
                attributes: []
            }
        ],
        raw: true
    });

    return sale[0].sale || 0;
}

module.exports = {
    // [GET] /statistic/api/overview
    showOverview: async (req, res, next) => {
        try {
            // today's sale compare to yesterday
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let todaySale = await getSaleInPeriod(today, new Date());

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const yesterdaySale = await getSaleInPeriod(yesterday, today);

            let growthRateDay = 0;
            if(yesterdaySale === 0) {
                if(todaySale === 0) {
                    growthRateDay = 0;
                } else {
                    growthRateDay = 100;
                }
            } else growthRateDay = (todaySale - yesterdaySale) / yesterdaySale * 100;

            // this month's sale compare to last month
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);
            let monthSale = await getSaleInPeriod(thisMonth, new Date());

            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            lastMonth.setDate(1);
            lastMonth.setHours(0, 0, 0, 0);
            const lastMonthSale = await getSaleInPeriod(lastMonth, thisMonth);

            let growthRateMonth = 0;
            if(lastMonthSale === 0) {
                if(monthSale === 0) {
                    growthRateMonth = 0;
                } else {
                    growthRateMonth = 100;
                }
            } else growthRateMonth = (monthSale - lastMonthSale) / lastMonthSale * 100;

            // year's sale and compare to last year
            const thisYear = new Date();
            thisYear.setMonth(0);
            thisYear.setDate(1);
            thisYear.setHours(0, 0, 0, 0);
            let yearSale = await getSaleInPeriod(thisYear, new Date());

            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            lastYear.setMonth(0);
            lastYear.setDate(1);
            lastYear.setHours(0, 0, 0, 0);
            const lastYearSale = await getSaleInPeriod(lastYear, thisYear);

            let growthRateYear = 0;
            if(lastYearSale === 0) {
                if(yearSale === 0) {
                    growthRateYear = 0;
                } else {
                    growthRateYear = 100;
                }
            } else growthRateYear = (yearSale - lastYearSale) / lastYearSale * 100;

            // today's order compare to yesterday
            let todayOrder = await Order.count({
                where: {
                    createdAt: {
                        [Op.gte]: today
                    }
                }
            });
            const yesterdayOrder = await Order.count({
                where: {
                    createdAt: {
                        [Op.between]: [yesterday, today]
                    }
                }
            });

            let growthRateOrderDay = 0;
            if(yesterdayOrder === 0) {
                if(todayOrder === 0) {
                    growthRateOrderDay = 0;
                } else {    
                    growthRateOrderDay = 100;
                }
            } else growthRateOrderDay = (todayOrder - yesterdayOrder) / yesterdayOrder * 100;

            res.status(200).json({
                todaySale,
                growthRateDay: growthRateDay.toPrecision(4),
                monthSale,
                growthRateMonth: growthRateMonth.toPrecision(4),
                yearSale,
                growthRateYear: growthRateYear.toPrecision(4),
                todayOrder,
                growthRateOrderDay: growthRateOrderDay.toPrecision(4)
            });

        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [GET] /statistic/api/sale-distributed-by-month
    showInYear: async (req, res, next) => {
        try{
            const year = req.query.year;
            let months = [];
            for(let i = 0; i < 12; ++i) {
                const from = new Date(year, i, 1, 0, 0, 0, 0);
                const to = new Date(year, i + 1, 1, 0, 0, 0, 0);
                const sale = await getSaleInPeriod(from, to);
                months[i] = sale;
            }

            res.status(200).json({
                data: months
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    // [GET] /statistic/api/sale-distributed-by-category
    showByCategory: async (req, res, next) => {
        try{
            const criterion = req.query.criterion;
            let from = new Date();
            let to = new Date();
            let pastFrom = new Date();
            let pastTo = new Date();
            if(criterion === 'day'){
                from.setHours(0, 0, 0, 0);
                pastFrom.setDate(pastFrom.getDate() - 1);
                pastFrom.setHours(0, 0, 0, 0);
                pastTo.setDate(pastTo.getDate() - 1);
                pastTo.setHours(23, 59, 59, 999);
            } else if (criterion === 'month') {
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                pastFrom.setMonth(pastFrom.getMonth() - 1);
                pastFrom.setDate(1);
                pastFrom.setHours(0, 0, 0, 0);
                pastTo.setDate(0);
                pastTo.setHours(23, 59, 59, 999);
            } else if (criterion === 'year') {
                from.setMonth(0);
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                pastFrom.setFullYear(pastFrom.getFullYear() - 1);
                pastFrom.setMonth(0);
                pastFrom.setDate(1);
                pastFrom.setHours(0, 0, 0, 0);
                pastTo.setMonth(0);
                pastTo.setDate(0);
                pastTo.setHours(23, 59, 59, 999);
            }

            const sale = await OrderItem.findAll({
                attributes: [
                    [sequelize.col('product.categoryId'), 'categoryId'],
                    [sequelize.col('product.category.name'), 'categoryName'],
                    [sequelize.fn('SUM', sequelize.literal('"OrderItems".quantity * price')), 'sale']
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: [],
                        include: {
                            model: Category,
                            as: 'category',
                            attributes: [],
                        },
                        right: true
                    },
                    {
                        model: Order,
                        as: 'order',
                        attributes: [],
                        where: {
                            status: 'completed',
                            createdAt: {
                                [Op.between]: [from, to]
                            }
                        },
                    }
                ],
                group: [sequelize.col('product.categoryId'), sequelize.col('product.category.name')],
            });

            const pastSale = await OrderItem.findAll({
                attributes: [
                    [sequelize.col('product.categoryId'), 'categoryId'],
                    [sequelize.col('product.category.name'), 'categoryName'],
                    [sequelize.fn('SUM', sequelize.literal('"OrderItems".quantity * price')), 'sale']
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: [],
                        include: {
                            model: Category,
                            as: 'category',
                            attributes: []
                        },
                        right: true
                    },
                    {
                        model: Order,
                        as: 'order',
                        attributes: [],
                        where: {
                            status: 'completed',
                            createdAt: {
                                [Op.between]: [pastFrom, pastTo]
                            }
                        }
                    }
                ],
                group: [sequelize.col('product.categoryId'), sequelize.col('product.category.name')],
            });

            const categories = await Category.findAll({
                attributes: ['id', 'name']
            });

            const data = categories.map(category => {
                const item = sale.find(sItem => sItem.dataValues.categoryId === category.dataValues.id);
                if(item) {
                    if(item.dataValues.sale === null) item.dataValues.sale = 0;
                    if(pastSale.length === 0) {
                        item.dataValues.growthRate = 100;
                    } else {
                        const pastItem = pastSale.find(pItem => pItem.dataValues.categoryId === item.dataValues.categoryId);
                        if(pastItem) {
                            item.dataValues.growthRate = ((item.dataValues.sale - pastItem.dataValues.sale) / pastItem.dataValues.sale * 100).toPrecision(4);
                        } else {
                            item.dataValues.growthRate = 100;
                        }
                    }
                    return item.dataValues;
                } else {
                    return {
                        categoryId: category.dataValues.id,
                        categoryName: category.dataValues.name,
                        sale: 0,
                        growthRate: -100
                    }
                }
            });

            res.status(200).json({
                data
            });
        
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    // [GET] /statistic/api/sale-by-period
    showByPeriod: async (req, res, next) => {
        try{
            let { from, to } = req.query;
            if(from){
                from = new Date(from);
                from.setHours(0, 0, 0, 0);
            } else {
                from = '1970-01-01';
            }
            if(to){
                to = new Date(to);
                to.setHours(23, 59, 59, 999);
            } else {
                to = '9999-12-31';
            }

            const data = await getSaleInPeriod(from, to);

            res.status(200).json({
                data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
 
    // [GET] /statistic/api/top-selling-products
    showTopSelling: async (req, res, next) => {
        try{
            const { limit } = req.query;
            const topSelling = await OrderItem.findAll({
                attributes: [
                    [sequelize.col('product.id'), 'productId'],
                    [sequelize.fn('SUM', sequelize.literal('"OrderItems".quantity')), 'sold']
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: [],
                    },
                    {
                        model: Order,
                        as: 'order',
                        attributes: [],
                        where: {
                            status: 'completed'
                        }
                    }
                ],
                group: [sequelize.col('product.id')],
                order: [
                    [sequelize.literal('sold'), 'DESC']
                ],
                limit: limit || 5,
                raw: true
            });
            console.log(topSelling);

            // map category and image
            for(let i = 0; i < topSelling.length; ++i) {
                const product = await Product.findByPk(topSelling[i].productId, {
                    attributes: ['id', 'name', 'price'],
                    include: [
                        {
                            model: Category,
                            as: 'category',
                        },
                        {
                            model: Image,
                            as: 'mainImage',
                            attributes: ['url']
                        }
                    ]
                });
                topSelling[i].product = product.dataValues;
            }

            res.status(200).json({
                data: topSelling
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    // [GET] /statistic/api/operation-years
    showYears: async (req, res, next) => {
        try{
            const years = await Order.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('DATE_PART', 'Year', sequelize.col('createdAt'))), 'year']
                ],
            });

            let data = [];
            if(years.length === 0) {
                data = [new Date().getFullYear()];
            } else {
                data = years.map(year => year.dataValues.year);
            }

            res.status(200).json({
                data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    // [GET] /statistic/api/recent-orders
    showRecentOrders: async (req, res, next) => {
        try{
            const { limit } = req.query;
            const orders = await Order.findAll({
                attributes: ['id', 'status', 'createdAt'],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit || 5,
                raw: true
            });

            orders.forEach(order => {
                order.formattedDate = new Intl.DateTimeFormat('vi', DateOptions).format(order.createdAt);
            });

            res.status(200).json({
                data: orders
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
}