const categoryDB = require("../db/db_category_helpers")
const productDB = require("../db/db_product_helpers")
const imageDB = require("../db/db_image_helpers")
module.exports = {
    getAllCategories: async () => {
        const allcategories = await categoryDB.getAllCategories();
        return allcategories
    },
    getAllPages: async (categoryID,filter) => {
        const allProduct = await productDB.getProductsByCategory(categoryID,filter);
     
        const result = Math.ceil(Object.keys(allProduct).length * 1.0 / 5);
        return (Array.from({ length: result }, (_, i) => new Object({ value: i + 1, current: false })));

    },
    getProductsByPage: async (categoryID, page,filter) => {
        const allProduct = await productDB.getProductsByCategory(categoryID,filter);
        const result = {
            list: [],
            current: page
        };
        for (let i=5 ; i > 0; i--)
        {
            if (allProduct[5*page -i])
            {
                if (allProduct[5*page -i].mainImageId)
                {
                    const image= await imageDB.getImageByImageID(allProduct[5*page -i].mainImageId);
                    // const image = await imageDB.getImageSrcByProductID(allProduct[5*page -i].ProductID);
                    if (image)
                    {
                        allProduct[5*page -i].Image  = image.Path;
                    }else{
                        allProduct[5*page -i].Image =""
                    }
                    
                }
                else{
                    allProduct[5*page -i].Image =""
                }
                result.list.push(allProduct[5*page -i]);
                
            }
        }
        return result
    },
    getAllProduct: async() =>{
        return await productDB.getAllProduct();
    },
    getProductByID:async(productID)=>{
        const product = await productDB.getProductByID(productID);
        console.log(product.mainImageId);
        const image = await imageDB.getImageByImageID(product.mainImageId);
        if (image){
            product.Image = image.Path;
        }
        else{
            product.Image = ""
        }
        return product; 
    },
    getAllFindPage: async(value)=>{
        const allFindProduct = await productDB.findProductsByValue(value);
        const result = Math.ceil(Object.keys(allFindProduct).length * 1.0 / 5);
        return (Array.from({ length: result }, (_, i) => new Object({ value: i + 1, current: false })));
       
    },
    getProductFindPage: async (value,page) =>{
        const allFindProduct = await productDB.findProductsByValue(value);
        const result = {
            list: [],
            current: page
        };
        for (let i=5 ; i > 0; i--)
        {
            if (allFindProduct[5*page -i])
            {
                if (allFindProduct[5*page -i].mainImageId)
                {
                    const image= await imageDB.getImageByImageID(allFindProduct[5*page -i].mainImageId);
                    // const image = await imageDB.getImageSrcByProductID(allProduct[5*page -i].ProductID);
                    if (image)
                    {
                        allFindProduct[5*page -i].Image  = image.Path;
                    }else{
                        allFindProduct[5*page -i].Image =""
                    }
                    
                }
                else{
                    allFindProduct[5*page -i].Image =""
                }
                result.list.push(allFindProduct[5*page -i]);
                
            }
        }
        return result
    },
    getRelatedProduct: async(productID)=>{
        const result =[]
        const categoryID = (await productDB.getProductByID(productID)).CategoryID;
        const relatedProduct = await productDB.getRelatedProduct(productID,categoryID);
        for (let i=0; i  < 4 ; i++)
        {
            if (relatedProduct[i])
            {
                if (relatedProduct[i].mainImageId)
                {
                    const image= await imageDB.getImageByImageID(relatedProduct[i].mainImageId);
                    // const image = await imageDB.getImageSrcByProductID(allProduct[5*page -i].ProductID);
                    if (image)
                    {
                        relatedProduct[i].Image  = image.Path;
                    }else{
                        relatedProduct[i].Image =""
                    }
                    
                }
                else{
                    relatedProduct[i].Image =""
                }
                // const image = await imageDB.getImageSrcByProductID(relatedProduct[i].ProductID);
                // if (image)
                // {
                //     relatedProduct[i].Image  = image.Path;
                // }
                // else{
                //     relatedProduct[i].Image =""
                // }
                result.push(relatedProduct[i]);
            }
        }
        return result
    },
    getAllImageByProduct: async(productID)=>{
        return await imageDB.getImageSrcByProductID(productID)
    }
    
}