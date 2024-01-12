const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const userTable = 'Customer'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
//const pg = pgp()
module.exports = {
    findUserByEmail: async(email)=>{
        const query = `SELECT * FROM public."${userTable}" WHERE "Email" = '${email}'`
        // console.log(query);
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0]; 
    },
    addNewUser: async(param)=>{
        const id = 2;
        const generator = UUID(id);
        const uuid = generator.uuid();
        const hashedPassword = await bcrypt.hash(param.password, 10);
        const query = `INSERT INTO public."${userTable}" ("CustomerID", "CustomerName", "PhoneNumber", "HomeAddress", "Email", "Password") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "CustomerID"`;
        const values = [uuid,param.name,param.phone_number,param.home_address,param.email_address, hashedPassword];
        // console.log(values);
        const data =  db.query(query, values);
        return data;
    }
}