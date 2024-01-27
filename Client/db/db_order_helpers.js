const pg = require('pg')
const bcrypt = require('bcrypt');
const productDB = require("../db/db_product_helpers")
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
        // console.log(result.rows);
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
    getOrderDetail: async(orderID)=>{
        const query = `SELECT * FROM public."${sub_table}" WHERE "OrderID" = '${orderID}' ORDER BY "Quantity" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        // console.log(result.rows);
        return result.rows; 
    },
    calculateTotal: async(orderID )=>{
        let total = 0 ;

        const result =  await db.query(`SELECT * FROM public."${sub_table}" WHERE "OrderID" = '${orderID}' ORDER BY "Quantity" DESC`);
        const products =  result.rows;
        for (i of products)
        {
            let res = await productDB.getProductByID(i.ProductID);
            total = total + i.Quantity*res.Price; 
        }
        return total; 
    },
    createOrder: async (userID) =>{
        const query = `INSERT INTO public."${table}" ("CustomerID") VALUES ($1) RETURNING "OrderID"`
        const values = [userID];
        const res = await db.query(query,values);
    //    console.log(res.rows[0].OrderID);
        return res.rows[0].OrderID; 
    },
    addOrderItem: async (OrderID, ProductID, Quantity) => {
        const query = `INSERT INTO public."${sub_table}" ("OrderID","ProductID","Quantity") VALUES ($1,$2,$3) RETURNING "ProductID"`
        const values = [OrderID,ProductID,Quantity];
        const res = await db.query(query,values);
        // console.log(res);
        return res;
    },
    updateStatus: async (OrderID, Status) => {
        const query = `UPDATE public."${table}" SET "Status" = '${Status}' WHERE  "OrderID" = '${OrderID}' ;`
        const result = await db.query(query);
        res = await db.query(`SELECT * FROM public."${table}" WHERE "OrderID" = '${OrderID}'`)
        // Check if any rows were returned
        return res.rows;
    }

}