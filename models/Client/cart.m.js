const cartDB = require('../../db/Client/db_cart_item_helpers')
const orderDB = require('../../db/Client/db_order_helpers')
const productDB = require("../../db/Client/db_product_helpers")
const imageDB = require("../../db/Client/db_image_helpers")
const userDB = require("../../db/Client/db_user_helpers")
module.exports = {
    addProductToUserCart: async (userID, productID) => {
        const check = await cartDB.getCartByUserAndProduct(userID,productID);
        if (!Object.is(check, null)) 
        {
            return null;
        }
        else{
            const add = await cartDB.addProductToUserCart(userID, productID)
            return add;
        }
       
    },
    getUserInfo: async (userID) => {
        return (await userDB.findUserByID(userID)).username;
    },
    getCartInfo: async (userID) => {
        const result = [];
        const cart = await cartDB.getCartByUser(userID);
        console.log(cart);
        for (i of cart) {
            const res = await productDB.getProductByID(i.productId);
            if (res.mainImageId)
            {
                const image = await imageDB.getImageByImageID(res.mainImageId);
                if (image)
                {
                    res.image = image.url
                }
                else{
                    res.image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
                }
            }else{
                res.image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
            }
           
            // const image = await imageDB.getImageSrcByProductID(i.ProductID);
            // if (image)
            // {
            //     res.Image = image.url
            // }
            // else{
            //     res.Image = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png"
            // }
            res.quantity = i.quantity;
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
            const product = await productDB.getProductByID(i.productId);
            if (product.quantity < i.quantity) {

                checkQuantity = false;
                // // error here 
                // break
                message = message + `\n  The remaining quantity of product ${product.name} is ${product.quantity} items`
                //break;
            }
        }
        if (checkQuantity) {
            const OrderID = await orderDB.createOrder(userID); //orderid
            for (i of cart) {  
                let result = await orderDB.addOrderItem(OrderID, i.productId, i.quantity);
                let subtract = await productDB.subProductInventoryQuantity(i.productId, i.quantity);
                let remove = await cartDB.removeCartItem(userID,i.productId);
            }
            //return OrderID;
            return {message:"checkout success!", OrderID: OrderID}; 
        }
        else{
            // error handle
            //return undefined;
            return {message:message, OrderID: "-1"};

        }
    }
}