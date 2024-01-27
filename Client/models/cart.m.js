const cartDB = require('../db/db_cart_item_helpers')
const orderDB = require('../db/db_order_helpers')
const productDB = require("../db/db_product_helpers")
const imageDB = require("../db/db_image_helpers")
const userDB = require("../db/db_user_helpers")
module.exports = {
    addProductToUserCart: async (userID, productID) => {
        const add = await cartDB.addProductToUserCart(userID, productID)
        return add;
    },
    getUserInfo: async (userID) => {
        return (await userDB.findUserByID(userID)).CustomerName;
    },
    getCartInfo: async (userID) => {
        const result = [];
        const cart = await cartDB.getCartByUser(userID);
        for (i of cart) {
            const res = await productDB.getProductByID(i.ProductID);
            if (res.mainImageId)
            {
                const image = await imageDB.getImageByImageID(res.mainImageId);
                if (image)
                {
                    res.Image = image.Path
                }
                else{
                    res.Image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
                }
            }else{
                res.Image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
            }
           
            // const image = await imageDB.getImageSrcByProductID(i.ProductID);
            // if (image)
            // {
            //     res.Image = image.Path
            // }
            // else{
            //     res.Image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
            // }
            res.CartQuantity = i.Quantity;
            result.push(res);
        }
        return result;
    },
    changeCartQuantity: async (productID, userID, quantity) => {
        await cartDB.changeCartQuantity(productID, userID, quantity)
    },
    removeCartItem: async (userID, productID) => {
        const remove = await cartDB.removeCartItem(userID, productID);
        return remove;
    },
    checkoutCart: async (userID) => {
        const cart = await cartDB.getCartByUser(userID);
        let checkQuantity = true;
        let message = `Storage: Insufficient inventory. `;
        for (i of cart) {
            // console.log(i.ProductID);
            const product = await productDB.getProductByID(i.ProductID);
            if (product.InventoryQuantity < i.Quantity) {
                checkQuantity = false;
                message = message + `\n  The remaining quantity of product ${product.ProductName} is ${product.InventoryQuantity} items`
            }
        }
        if (checkQuantity) {
            const OrderID = await orderDB.createOrder(userID); //orderid
            for (i of cart) {  

                let result = await orderDB.addOrderItem(OrderID, i.ProductID, i.Quantity);

                let subtract = await productDB.subProductInventoryQuantity(i.ProductID, i.Quantity);

                let remove = await cartDB.removeCartItem(userID,i.ProductID);
            }
            return {message:"checkout success!", OrderID: OrderID}; 
        }
        else{
            return {message:message, OrderID: "-1"};
        }
    }
}