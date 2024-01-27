const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Images'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    getImageSrcByProductID: async(id)=>{
        const query = `SELECT * FROM public."${table}" WHERE "productId" = '${id}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows;
        
    },
    getImageByImageID: async (id)=>{
        const query = `SELECT * FROM public."${table}" WHERE "id" = '${id}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0]; 
    }
}