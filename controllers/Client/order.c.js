const orderModel = require("../../models/Client/order.m");
require('dotenv').config()
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
        res.render("home",{ layout: "orderdetails", url_payment: process.env.PAYMENT_SYS_URL , orderInfo: orderInfo, userInfo: userInfo, orderDetail: orderDetail, userID: userID})
        // res.json({orderInfo: orderInfo, userInfo: userInfo, orderDetail: orderDetail});
    },
    OrderDetail: async(req,res)=>{
        const userID = req.user.id;
        const userInfo = req.query.userInfo;
        const orderInfo = req.query.orderInfo;
        const orderDetail = req.query.orderDetail;
        // console.log(orderDetail); 
        res.render("home",{ layout: "orderdetails", orderInfo: orderInfo, userInfo: userInfo, orderDetail: orderDetail})
    }, 
    StatusUpdate: async(req,res)=>{
        const OrderID = req.query.id;
        const Status = req.query.status;
        const tCode = req.query.tCode || "";
        const result = await orderModel.updateStatus(OrderID,Status,tCode);
        res.json({});
    },
}