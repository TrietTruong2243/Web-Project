const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const table = 'Image'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    getImageSrcByProductID: async(id)=>{
        const query = `SELECT * FROM public."${table}" WHERE "ProductID" = '${id}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0]; 
        
    }
}