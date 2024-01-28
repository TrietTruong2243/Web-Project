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
    },
    insertImageProfile: async(result,user)=>{
       
        const query = `INSERT INTO public."${table}" ("url", "public_id","userId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5)`
        // console.log(query);
        const res = [result.secure_url,result.public_id,user.id,new Date().toISOString(), new Date().toISOString()]
       await db.query(query,res);
        // Check if any rows were returned
        // return result.rows[0]; 
    },
    getImageByUserID: async(id)=>{
        const query = `SELECT * FROM public."${table}" WHERE "userId" = '${id}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0]; 
    }
}