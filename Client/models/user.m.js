const db = require("../db/db_user_helpers")
const bcrypt = require("bcrypt")
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
            // return -1;
            const newUser = await db.addGoogleUser(param);
            const user = await db.findUserByEmail(param.email)
            return user;
        }
    },
    changeUserInfo: async (userid, userinfo)=>
    {
        const findUser = await db.findUserByID(userid);
        const oldPassword = findUser.Password;
        let checkPass =   await bcrypt.compare(userinfo.current_password,oldPassword );
        if (checkPass === false)
        {
            return -1;//Mật khẩu không hợp lệ
        }
        else{
            const updateUser = await db.updateUser(userid, userinfo);
            if (updateUser)
            {
                return 1;
            }
            else{
                return 0;
            }
        }
    
    },
    changeGGUserInfo: async (userid, userinfo)=>
    {
        // const findUser = await db.findUserByID(userid);
        const updateUser = await db.updateUser(userid, userinfo);
        if (updateUser)
        {
            return 1;
        }
        else{
            return 0;
        }
    },
    getUserByEmail: async (email)=>{
        return await db.findUserByEmail(email);
    }
}