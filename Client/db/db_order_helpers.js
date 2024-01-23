const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Order'
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
    }
}