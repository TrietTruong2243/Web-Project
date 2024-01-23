const orderModel = require("../models/order.m");
module.exports = {
    getOrderDetail: async(req,res)=>{
        const userID = req.user.id;
        const orderID = req.query.OrderID;
        //note: 
        //      userInfo: user's information (name, address, phonenum, email)
        //      orderInfo: order's information (status, date, total ammount)
        //      orderDetail: information of products in order
        const userInfo = await orderModel.getUserInfo(userID);
        const orderInfo = await orderModel.getOrderInfo(orderID);
        const orderDetail = await orderModel.getOrderDetail(orderID);
        res.json({orderInfo: orderInfo, userInfo: userInfo, orderDetail: orderDetail});
    },
    OrderDetail: async(req,res)=>{
        const userID = req.user.id;

        const userInfo = req.query.userInfo;
        const orderInfo = req.query.orderInfo;
        const orderDetail = req.query.orderDetail;
        res.render("home",{ layout: "cart", orderInfo: orderInfo, userInfo: userInfo, orderDetail: orderDetail})
    },
}