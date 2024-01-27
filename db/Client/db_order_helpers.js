const pg = require('pg')
const bcrypt = require('bcrypt');
const productDB = require("../Client/db_product_helpers")
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Orders'
const sub_table = "OrderItems";
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();

module.exports = {

    getAllOrderByUser: async(userID)=>{
        const query = `SELECT * FROM public."${table}" WHERE "userId" = '${userID}' ORDER BY "createdAt" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        // console.log(result.rows);
        return result.rows; 
    },
    getOrderInfo: async( orderID)=>{
        const query = `SELECT * FROM public."${table}" WHERE "id" = '${orderID}' ORDER BY "createdAt" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        // console.log(result.rows[0]);
        return result.rows[0]; 
    },
    getOrderDetail: async(orderID)=>{
        const query = `SELECT * FROM public."${sub_table}" WHERE "orderId" = '${orderID}' ORDER BY "quantity" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        // console.log(result.rows);
        return result.rows; 
    },
    calculateTotal: async(orderID )=>{
        let total = 0 ;
        const result =  await db.query(`SELECT * FROM public."${sub_table}" WHERE "orderId" = '${orderID}' ORDER BY "quantity" DESC`);
        const products =  result.rows;
        for (i of products)
        {
            let res = await productDB.getProductByID(i.productId);
            total = total + i.quantity*res.price; 
        }
        return total; 
    },
    createOrder: async (userID) =>{
        const query = `INSERT INTO public."${table}" ("userId","createdAt","updatedAt") VALUES ($1,$2,$3) RETURNING "id"`
        const values = [userID, new Date().toISOString(),new Date().toISOString()];
        const res = await db.query(query,values);
        return res.rows[0].id; 
    },
    addOrderItem: async (OrderID, ProductID, Quantity) => {
        const query = `INSERT INTO public."${sub_table}" ("orderId","productId","quantity","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5) RETURNING "productId"`
        const values = [OrderID,ProductID,Quantity, new Date().toISOString(),new Date().toISOString()];
        const res = await db.query(query,values);
        // console.log(res);
        return res;
    },
    updateStatus: async (OrderID, Status) => {
        const query = `UPDATE public."${table}" SET "status" = '${Status}' WHERE  "id" = '${OrderID}' ;`
        const result = await db.query(query);
        res = await db.query(`SELECT * FROM public."${table}" WHERE "id" = '${OrderID}'`)
        // Check if any rows were returned
        return res.rows;
    }
}