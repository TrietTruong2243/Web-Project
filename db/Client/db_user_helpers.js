const pg = require('pg')
const bcrypt = require('bcrypt');
const UUID = require('uuid-int');
require('dotenv').config();
const userTable = 'Users'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
//const pg = pgp()
module.exports = {
    findUserByID: async(id)=>{
    const query = `SELECT * FROM public."${userTable}" WHERE "id" = '${id}'`
    const result = await db.query(query);
    // Check if any rows were returned
    return result.rows[0]; 
},
    findUserByEmail: async(email)=>{
        const query = `SELECT * FROM public."${userTable}" WHERE "email" = '${email}'`
        const result = await db.query(query);
        console.log(result);
        // Check if any rows were returned
        return result.rows[0]; 
    },
    addNewUser: async(param)=>{
        var currentdate = new Date().toISOString();
        const hashedPassword = await bcrypt.hash(param.password, 10);
        const query = `INSERT INTO public."${userTable}" ("fullname", "phone", "address", "email", "password","username","createdAt","updatedAt","isGGAcc") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING "id","username"`;
        const values = [param.name,param.phone_number,param.home_address,param.email_address, hashedPassword,param.username,currentdate,currentdate,0];
        // console.log(values);
        const data = await db.query(query, values);
        return data;
    },
    addGoogleUser: async(param)=>{
        const query = `INSERT INTO public."${userTable}" ( "email","isGGAcc","createdAt","updatedAt") VALUES ($1,$2,$3,$4) RETURNING "id"`;
        const values = [param.email, 1,new Date().toISOString(), new Date().toISOString()];
        const data =  db.query(query, values);
        return data;
    },  
    updateUser: async(id, userinfo)=>{      
          var currentdate = new Date().toISOString();

        const query = `UPDATE public."${userTable}"
        SET "fullname"='${userinfo.name}', "phone"='${userinfo.phone_number}', "address"='${userinfo.home_address}', "email"='${userinfo.email_address}', "username" = '${userinfo.username}', "updatedAt" = '${currentdate}'
        WHERE  "id"='${id}' RETURNING "id";`
        const data = await  db.query(query);
        return data;
    },
    updataUserPassword: async(id,password)=>{
        const query = `UPDATE public."${userTable}"
        SET "password"= '${password}' ,"updatedAt" = '${new Date().toISOString()}'
        WHERE  "id"='${id}' RETURNING "id";`
        const data = await  db.query(query);
        return data;
    },
    updateGGUser: async(id, userinfo)=>{
        let date = new Date().toISOString();
               const query = `UPDATE public."${userTable}"
        SET "fullname"='${userinfo.name}', "phone"='${userinfo.phone_number}', "address"= '${userinfo.home_address}', "username" = '${userinfo.username}', "updatedAt" = '${date}'
        WHERE "id"='${id}' RETURNING "id";`
        // const value = [date]
        const data = await  db.query(query);
        console.log(data);
        return data;
    },
    findAllUserByEmail: async(email)=>{
        const query = `SELECT * FROM public."${userTable}" WHERE "email" = '${email}'`
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows; 
    },
    findUserByUserName: async(username)=>{
        const query = `SELECT * FROM public."${userTable}" WHERE "username" = '${username}'`
        const result = await db.query(query);
        // Check if any rows were returned
        return result.rows[0]; 
    }
}