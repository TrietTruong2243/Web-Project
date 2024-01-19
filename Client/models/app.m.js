const categoryDB = require("../db/db_category_helpers")
const productDB = require("../db/db_product_helpers")
const imageDB = require("../db/db_image_helpers")
module.exports = {
    getAllCategories: async () => {
        const allcategories = await categoryDB.getAllCategories();
        return allcategories
    },
    getAllPages: async (categoryID) => {
        const allProduct = await productDB.getProductsByCategory(categoryID);
        const result = Math.ceil(Object.keys(allProduct).length * 1.0 / 3);

        return (Array.from({ length: result }, (_, i) => new Object({ value: i + 1, current: false })));

    },
    getProductsByPage: async (categoryID, page) => {
        const allProduct = await productDB.getProductsByCategory(categoryID);
        const result = {
            list: [],
            current: page
        };
        for (let i=3 ; i > 0; i--)
        {
            if (allProduct[3*page -i])
            {
                const image = await imageDB.getImageSrcByProductID(allProduct[3*page -i].ProductID);
                if (image)
                {
                    allProduct[3*page -i].Image  = image.Path;
                }
                else{
                    allProduct[3*page -i].Image =""
                }
                result.list.push(allProduct[3*page -i]);
                
            }
        }
        return result
    },
    getProductByID:async(productID)=>{
        const product = await productDB.getProductByID(productID);
        const image = await imageDB.getImageSrcByProductID(productID);
        if (image){
            product.Image = image.Path;
        }
        else{
            product.Image = ""
        }
        return product;
    }
}