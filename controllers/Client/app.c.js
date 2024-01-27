const model = require("../../models/Client/app.m");
// const { all } = require("../routers/app.r");

module.exports = {
    homepage: async (req, res) => {
        res.render("home", { layout: 'homepage' })
    },
    getAllCategories: async (req, res) => {
        const categories = await model.getAllCategories();
        categories.unshift({ id: 0, name: "Tất cả sản phẩm" })
        // const categoryID = categories[0].CategoryID;
        // res.cookie('categoryid',categoryID);
        res.json({ categories: categories })
    },
    getAllPageByCategory: async (req, res) => {
        const categoryID = req.query.categoryID;

        if (req.query.filter) {
            const allpage = await model.getAllPages(categoryID, req.query.filter);
            const firstPage = await model.getProductsByPage(categoryID, 1, req.query.filter);
            res.json({ firstPage: firstPage, allpage: allpage })
        }
        else {
            const allpage = await model.getAllPages(categoryID);
            const firstPage = await model.getProductsByPage(categoryID, 1);
         
            res.json({ firstPage: firstPage, allpage: allpage })
        }
    },
    getProductByPage: async (req, res) => {
        const page = req.query.page;
        const categoryID = req.query.category;
        const filter = req.query.filter;

        const pagedata = await model.getProductsByPage(categoryID, page, filter);

        res.json({ pagedata: pagedata })

    },
    viewProduct: async (req, res) => {
        if (req.user) {
            isDisabled = false;
        }
        else {
            isDisabled = true;
        }
        const productID = req.query.id;
        const product = await model.getProductByID(productID);
        const relatedProduct = await model.getRelatedProduct(productID);
        const allImages = await model.getAllImageByProduct(productID);
        res.render("home", {
            layout: "product", productName1: product.ProductName, product: product, relatedProduct: relatedProduct, isDisabled: isDisabled, allImages: allImages
        })
    },
    search: async (req, res) => {
        res.render("home", { layout: "search" })
    },
    searchProduct: async (req, res) => {
        const value = req.query.value;
        const allPage = await model.getAllFindPage(value);
        const first3Product = await model.getProductFindPage(value, 1);
        res.json({ allpage: allPage, firstPage: first3Product });
    },
    getFindProductByPage: async (req, res) => {
        const page = req.query.page;
        const value = req.query.value;
        const pagedata = await model.getProductFindPage(value, page);
        res.json({ pagedata: pagedata })
    },
    getAllPageByFilter: async (req, res) => {
        const filter = req.query.filter;
        const categoryID = req.query.categoryID;
        const allpage = await model.getAllPages(categoryID, filter);
        const firstPage = await model.getProductsByPage(categoryID, 1, filter);
        res.json({ firstPage: firstPage, allpage: allpage })

    }
}