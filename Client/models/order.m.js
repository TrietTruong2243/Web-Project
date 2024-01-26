const cartDB = require('../db/db_cart_item_helpers')
const orderDB = require('../db/db_order_helpers')
const productDB = require("../db/db_product_helpers")
const imageDB = require("../db/db_image_helpers")
const userDB = require("../db/db_user_helpers")
function formatDate(inputDate) {
    var date = new Date(inputDate);
    var day = date.getDate();
    var month = date.getMonth() + 1; // Lưu ý rằng tháng trong JavaScript bắt đầu từ 0
    var year = date.getFullYear(); // Lấy hai chữ số cuối cùng của năm

    // Định dạng: dd/mm/yy
    var formattedDate = day + "/" + month + "/" + year;

    return formattedDate;
    }
module.exports = {

    getUserInfo: async(userID)=>{
        const user = await userDB.findUserByID(userID);
        const data = { Name: user.CustomerName, Email: user.Email, Address: user.HomeAddress, PhoneNumber: user.PhoneNumber };
        return data;
    },
    getOrderInfo: async( orderID )=>{
        let  order = await orderDB.getOrderInfo(orderID);
        order.TotalAmount = await orderDB.calculateTotal(orderID);
        if(!order) return;
        let check = true;
        let refund = false;
        let cancel = false;
        if(order.Status === "cancelled") cancel =true;
        if(order.Status === "refunded") refund = true;
        if(order.Status === "Wait" || order.Status === "Processing" || order.Status === "pending"|| order.Status === "confirmed"|| order.Status === "unpaid") check = false;
        const data = { OrderID: order.OrderID, Date: formatDate(order.OrderDate), Total: order.TotalAmount, Status: order.Status, Check: check, Cancel: cancel, Refund: refund};
        return data; 
    },
    getOrderDetail: async( orderID )=>{
        const result =[];
        const order = await orderDB.getOrderDetail(orderID);
        for (i of order)
        {
            let res = await productDB.getProductByID(i.ProductID);
            const image = await imageDB.getImageByImageID(res.mainImageId);
            if (image)
            {
                res.Image = image.Path
            }
            else{
                res.Image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
            }
            res.Quantity = i.Quantity;   
            // console.log(res); 
            result.push(res);
        }
        return result; 
    },
    calculateTotal: async( orderID )=>{
        let total = await orderDB.calculateTotal(orderID);
        return total;

    },
}