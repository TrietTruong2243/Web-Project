const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Order'
const sub_table = "OrderProductDetail";
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();

module.exports = {
    getAllOrderByUser: async(userID)=>{
        const query = `SELECT * FROM public."${table}" WHERE "CustomerID" = '${userID}' ORDER BY "OrderDate" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        console.log(result.rows);
        return result.rows; 
    },
    getOrderInfo: async( orderID)=>{
        const query = `SELECT * FROM public."${table}" WHERE "OrderID" = '${orderID}' ORDER BY "OrderDate" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        // console.log(result.rows[0]);
        return result.rows[0]; 
    },
    getOrderDetail: async( orderID)=>{
        const query = `SELECT * FROM public."${sub_table}" WHERE "OrderID" = '${orderID}' ORDER BY "Quantity" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        // console.log(result.rows);
        return result.rows; 
    }
}