const model = require("../models/app.m");
// const { all } = require("../routers/app.r");

module.exports = {
    homepage: async (req,res)=>{
        res.render("home")
    },
    getAllCategories: async(req,res)=>{
        const categories = await model.getAllCategories();
        const categoryID = categories[0].CategoryID;
        res.cookie('categoryid',categoryID);
        res.json({categories: categories})
    },
    getAllPageByCategory: async(req,res)=>{
        const categoryID = req.query.categoryID;
        const allpage = await  model.getAllPages(categoryID);
        const firstPage = await model.getProductsByPage(categoryID,1);
        res.cookie('categoryid',categoryID);
        res.json({firstPage: firstPage, allpage: allpage})
    },
    getProductByPage: async(req,res)=>{
        const page = req.query.page;
        const categoryID = req.cookies['categoryid'];
        const pagedata = await model.getProductsByPage(categoryID,page);

        res.json({pagedata: pagedata})
    
    },
    viewProduct: async(req,res)=>{
        const productID = req.query.id;
        const product = await model.getProductByID(productID);

        res.render("home", {layout: "product", productName1: product.ProductName ,productImage:product.Image,productName2:product.ProductName ,productPrice: product.Price, 
        productDescribe: product.Describe, productQuantity: product.InventoryQuantity   })
    }
}