const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'CartItems'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    addProductToUserCart: async (userid, productId, quantity = 1) => {
        try {
            const query = `INSERT INTO public."${table}" ("userId", "productId","quantity","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5) RETURNING "productId"`
            // console.log(query);
            const values = [userid, productId, quantity, new Date().toISOString(), new Date().toISOString()]
            console.log(query);
            const result = await db.query(query, values);
            // Check if any rows were returned
            console.log(result.rows);
            return result.rows;
        }
        catch (err) {
            console.log(err);
            return null
        }

    },
    getCartByUser: async (userID) => {
        const query = `SELECT * FROM public."${table}" WHERE "userId" = '${userID}' ORDER BY "quantity" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
    },
    changeCartQuantity: async (productId, userID, quantity) => {
        const date =  new Date().toISOString();
        const query = `UPDATE public."${table}"
        SET "quantity"='${quantity}', "updatedAt" = '${date}'
        WHERE  "userId"='${userID}' AND "productId" = '${productId}' RETURNING "userId";`
        console.log(query);
        const data = await db.query(query);
        return data;
    },
    removeCartItem: async (userID, productId) => {
        const query = `DELETE  FROM public."${table}"
        WHERE  "userId"='${userID}' AND "productId" = '${productId}';`
        const data = await db.query(query);
        return data;
    },
    getCartByUserAndProduct: async (userID, productID) => {
        const query = `SELECT * FROM public."${table}" WHERE "userId" = '${userID}' AND "productId" = '${productID}' ORDER BY "quantity" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        if (result.rows.length == 0) {
            console.log("ffdas");
            return null;
        }
        return result.rows;
    }
}