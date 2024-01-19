const db = require("../db/db_user_helpers")
module.exports = {
    getUserByID: async(id)=>{
        const user = await db.findUserByID(id);
      
        return user;
    },
    findUserByEmail: async(email)=>{
        const user = await db.findUserByEmail(email);
        return user;
    },
    findOrCreateUser: async(param)=>{
        const findUser = await db.findUserByEmail(param.email);
        if (findUser)
        {
            return findUser;
        }
        else{
            const newUser = await db.addGoogleUser(param);
            const user = await db.findUserByEmail(param.email)
            return user;
        }
    }
}