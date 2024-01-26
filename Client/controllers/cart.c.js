const model = require("../models/cart.m");
module.exports = {
    cartview: async(req,res)=>{
        res.render("home", {layout :"cart"});
    },
    addToCart: async(req,res)=>{
        
        const addtoCart = await model.addProductToUserCart(req.user.id, req.body.id);
        if (addtoCart)
        {
            res.json("Thêm vào giỏ hàng thành công")

        }
        else{
            res.json("Sản phẩm đã tồn tại trong giỏ hàng")
        }
    },
    getCartInfo: async(req,res)=>{
        const userID = req.user.id;
        const userinfo = await model.getUserInfo(userID);
        const cartInfo = await model.getCartInfo(userID);
        res.json({cartInfo: cartInfo, userName: userinfo});
    },
    changeCartQuantity: async(req,res)=>{
        const productID = req.query.productID;
        const quantity = req.query.quantity;
        const userID = req.user.id;
        await model.changeCartQuantity(productID,userID,quantity);
        res.json("Success")
    },
    removeCartItem: async(req,res)=>{
        const productID = req.query.productID;
        const userID = req.user.id;
        const remove = await model.removeCartItem(userID,productID)
        res.json("Remove success")
    },
    checkoutCart: async(req,res)=>{
        const userID = req.user.id;
        const checkout = await model.checkoutCart(userID);
        console.log(checkout);
        const url = "http://localhost:3000/order/getorderdetail?OrderID=" + toString(checkout);
        res.redirect(url);
    }
}