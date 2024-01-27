const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Products'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    getProductsByCategory: async (id, filter) => {
        var query;
        // console.log(filter);
        if (id == 0) {
            if (!filter || (filter.minPrice=='' && filter.maxPrice=='')) {
                query = `SELECT * FROM public."${table}" `
            }
            else if (!filter.minPrice || filter.minPrice=='') {
                query = `SELECT * FROM public."${table}" WHERE "price" < '${filter.maxPrice}'`

            }
            else if (!filter.maxPrice ||filter.maxPrice=='') {
                query = `SELECT * FROM public."${table}" WHERE"price" > '${filter.minPrice}'`

            }
            else {
                query = `SELECT * FROM public."${table}" WHERE "price" < '${filter.maxPrice}'AND "price" > '${filter.minPrice}'`

            }
            // console.log(query);
            const result = await db.query(query);
            // Check if any rows were returned
            return result.rows;
        }
        if (!filter || (filter.minPrice=='' && filter.maxPrice=='')) {
            query = `SELECT * FROM public."${table}" WHERE "categoryId" ='${id}'`
        }
        else if (!filter.minPrice|| filter.minPrice=='') {
            query = `SELECT * FROM public."${table}" WHERE "categoryId" ='${id}' AND "price" < '${filter.maxPrice}'`

        }
        else if (!filter.maxPrice ||filter.maxPrice=='') {
            query = `SELECT * FROM public."${table}" WHERE "categoryId" ='${id}' AND "price" > '${filter.minPrice}'`

        }
        else {
            query = `SELECT * FROM public."${table}" WHERE "categoryId" ='${id}' AND "price" < '${filter.maxPrice}'AND "price" > '${filter.minPrice}'`

        }
        // console.log(query);
        //const query = `SELECT * FROM public."${table}" WHERE "categoryId" ='${id}'`
        // console.log(query);
       
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getProductByID: async (id) => {
        const query = `SELECT * FROM public."${table}" WHERE "id" ='${id}'`
        // console.log(query); 
        
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0];
    },
    findProductsByValue: async (value) => {
        const query = `SELECT * FROM public."${table}" WHERE "name" LIKE '%${value}%'`
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getRelatedProduct: async (productID, categoryId) => {
        const query = `SELECT * FROM public."${table}" WHERE "id" != '${productID}' AND "categoryId" = '${categoryId}'`

        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getAllProduct: async () => {
        const query = `SELECT * FROM public."${table}"`

        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    subProductInventoryQuantity: async (ProductID, Quantity) =>{
        let res = await db.query(`SELECT * FROM public."${table}" WHERE "id" = '${ProductID}'`)

        const INVQuantity = res.rows[0].quantity - Quantity;
        const query = `UPDATE public."${table}" SET "quantity" = '${INVQuantity}' WHERE  "id" = '${ProductID}' ;`
        const result = await db.query(query);
        res = await db.query(`SELECT * FROM public."${table}" WHERE "id" = '${ProductID}'`)
        // Check if any rows were returned
        return res.rows;
    }
}