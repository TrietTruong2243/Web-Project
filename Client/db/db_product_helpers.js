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
    getProductsByCategory: async (id, filter) => {
        var query;
        // console.log(filter);
        if (id == 0) {
            if (!filter || (filter.minPrice=='' && filter.maxPrice=='')) {
                query = `SELECT * FROM public."${table}" `
            }
            else if (!filter.minPrice || filter.minPrice=='') {
                query = `SELECT * FROM public."${table}" WHERE "Price" < '${filter.maxPrice}'`

            }
            else if (!filter.maxPrice ||filter.maxPrice=='') {
                query = `SELECT * FROM public."${table}" WHERE"Price" > '${filter.minPrice}'`

            }
            else {
                query = `SELECT * FROM public."${table}" WHERE "Price" < '${filter.maxPrice}'AND "Price" > '${filter.minPrice}'`

            }
            console.log(query);
            const result = await db.query(query);
            // Check if any rows were returned
            return result.rows;
        }
        if (!filter || (filter.minPrice=='' && filter.maxPrice=='')) {
            query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}'`
        }
        else if (!filter.minPrice|| filter.minPrice=='') {
            query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}' AND "Price" < '${filter.maxPrice}'`

        }
        else if (!filter.maxPrice ||filter.maxPrice=='') {
            query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}' AND "Price" > '${filter.minPrice}'`

        }
        else {
            query = `SELECT * FROM public."${table}" WHERE "CategoryID" ='${id}' AND "Price" < '${filter.maxPrice}'AND "Price" > '${filter.minPrice}'`

        }
        // console.log(query);
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
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getRelatedProduct: async (productID, categoryID) => {
        const query = `SELECT * FROM public."${table}" WHERE "ProductID" != '${productID}' AND "CategoryID" = '${categoryID}'`

        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    getAllProduct: async () => {
        const query = `SELECT * FROM public."${table}"`

        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    }
}