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
    findUserByID: async(id)=>{
    const query = `SELECT * FROM public."${userTable}" WHERE "CustomerID" = '${id}'`
    const result = await db.query(query);
    // Check if any rows were returned
    return result.rows[0]; 
},
    findUserByEmail: async(email)=>{
        const query = `SELECT * FROM public."${userTable}" WHERE "Email" = '${email}'`
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0]; 
    },
    addNewUser: async(param)=>{
        const id = 2;
        const generator = UUID(id);
        const uuid = generator.uuid();
        const hashedPassword = await bcrypt.hash(param.password, 10);
        const query = `INSERT INTO public."${userTable}" ("CustomerID", "CustomerName", "PhoneNumber", "HomeAddress", "Email", "Password","IsGoogleAccount") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING "CustomerID"`;
        const values = [uuid,param.name,param.phone_number,param.home_address,param.email_address, hashedPassword,0];
        // console.log(values);
        const data =  db.query(query, values);
        return data;
    },
    addGoogleUser: async(param)=>{
        const query = `INSERT INTO public."${userTable}" ("CustomerID",  "Email","IsGoogleAccount") VALUES ($1,$2,$3) RETURNING "CustomerID"`;
        const values = [param.id,param.email, 1];
        const data =  db.query(query, values);
        return data;
    },  
    updateUser: async(id, userinfo)=>{
        const query = `UPDATE public."Customer"
        SET "CustomerName"='${userinfo.name}', "PhoneNumber"='${userinfo.phone_number}', "HomeAddress"='${userinfo.home_address}', "Email"='${userinfo.email_address}', "Password"='${userinfo.password}'
        WHERE  "CustomerID"='${id}' RETURNING "CustomerID";`
        const data = await  db.query(query);
        return data;
    },
    updateGGUser: async(id, userinfo)=>{
        const query = `UPDATE public."Customer"
        SET  "CustomerName"='${userinfo.name}', "PhoneNumber"='${userinfo.phone_number}', "HomeAddress"= '${userinfo.home_address}' 
        WHERE "CustomerID"='${id}' RETURNING "CustomerID";`
        const data = await  db.query(query);
        return data;
    }
}