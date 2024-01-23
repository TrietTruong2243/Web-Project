const cartDB = require('../db/db_cart_item_helpers')
const orderDB = require('../db/db_order_helpers')
const productDB = require("../db/db_product_helpers")
const imageDB = require("../db/db_image_helpers")
const userDB = require("../db/db_user_helpers")
module.exports = {
    getAllOrderOfUser: async(userID )=>{
        const AllOrder = await orderDB.getAllOrderByUser(userID);
        return AllOrder;
    },
}