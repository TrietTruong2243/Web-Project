const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'CartItem'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    addProductToUserCart: async(userid, productid, quantity = 1)=>{
        try{
            const query = `INSERT INTO public."${table}" ("CustomerID", "ProductID","Quantity") VALUES ($1,$2,$3) RETURNING "ProductID"`
            // console.log(query);
            const values = [userid,productid,quantity]
            const result = await db.query(query,values);
            // Check if any rows were returned
            return result.rows; 
        }
        catch(err){
            return null
        }
        
    },
    getCartByUser: async(userID)=>{
        const query = `SELECT * FROM public."${table}" WHERE "CustomerID" = '${userID}' ORDER BY "Quantity" DESC`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows; 
    },
    changeCartQuantity:async(productID,userID,quantity)=>{
        const query = `UPDATE public."${table}"
        SET "Quantity"='${quantity}'
        WHERE  "CustomerID"='${userID}' AND "ProductID" = '${productID}' RETURNING "CustomerID";`
        const data = await  db.query(query);
        return data;
    },
    removeCartItem: async(userID,productID)=>{
        const query = `DELETE  FROM public."${table}"
        WHERE  "CustomerID"='${userID}' AND "ProductID" = '${productID}';`
        const data = await  db.query(query);
        return data;
    },

}