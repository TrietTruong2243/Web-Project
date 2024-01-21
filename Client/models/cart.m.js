const cartDB = require('../db/db_cart_item_helpers')
const productDB = require("../db/db_product_helpers")
const imageDB = require("../db/db_image_helpers")
const userDB = require("../db/db_user_helpers")
module.exports = {
    addProductToUserCart: async(userID, productID)=>{
        const add = await cartDB.addProductToUserCart(userID, productID)
        return add;
    },
    getUserInfo: async(userID)=>{
        return (await userDB.findUserByID(userID)).CustomerName;
    },
    getCartInfo: async(userID )=>{
        const result =[];
        const cart = await cartDB.getCartByUser(userID);
        for (i of cart)
        {
            const res = await productDB.getProductByID(i.ProductID);
            const image = await imageDB.getImageSrcByProductID(i.ProductID);
            if (image)
            {
                res.Image = image.Path
            }
            else{
                res.Image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
            }
            res.CartQuantity = i.Quantity;
            result.push(res);
        }
        return result;
    },
    changeCartQuantity:async(productID,userID,quantity)=>{
        await cartDB.changeCartQuantity(productID,userID,quantity)
    },
    removeCartItem: async(userID,productID)=>{
        const remove = await cartDB.removeCartItem(userID,productID);
        return remove;
    }
}