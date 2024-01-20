const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Product'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    getProductsByCategory: async (id, filter = "default") => {
        var query
        switch (filter) {
            case "default":
                query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}'`
                break;
            case "under1":
                query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}' AND "Price" <= '1000000'`

                break;
            case "under3":
                query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}' AND "Price" > '1000000' AND "Price" <='3000000'`

                break;
            case "over3":
                query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}' AND "Price" > '3000000'`

                break;
        }
        //const query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getProductByID: async (id) => {
        const query = `SELECT * FROM public."${table}" WHERE "ProductID" ='${id}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0];
    },
    findProductsByValue: async (value) => {
        const query = `SELECT * FROM public."${table}" WHERE "ProductName" LIKE '%${value}%'`
        console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getRelatedProduct: async (productID, categoryID) => {
        const query = `SELECT * FROM public."${table}" WHERE "ProductID" != '${productID}' AND "CategoryID" = '${categoryID}'`

        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    }
}