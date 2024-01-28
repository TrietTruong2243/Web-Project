const db = require("../../db/Client/db_user_helpers");
const orderDB = require("../../db/Client/db_order_helpers");
const productDB = require("../../db/Client/db_product_helpers");
const imageDB = require("../../db/Client/db_image_helpers")
const bcrypt = require("bcrypt")


module.exports = {
    getAllOrderOfUser: async(userID )=>{
        const AllOrder = await orderDB.getAllOrderByUser(userID);
        let result = AllOrder;
        for (i of result)
        {
            i.TotalAmount =  await orderDB.calculateTotal(i.id);
        }
        return result;
    },
    getUserByID: async(id)=>{
        const user = await db.findUserByID(id);
        const image = await imageDB.getImageByUserID(id);
        if (image)
        {
            user.image = image.url
        }
        else{
            user.image = "/img/user.png"
        }
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
        // const findUser = await db.findUserByID(userid);
        // const oldPassword = findUser.Password;
        // let checkPass =   await bcrypt.compare(userinfo.current_password,oldPassword );
        // if (checkPass === false)
        // {
        //     return -1;//Mật khẩu không hợp lệ
        // }
        // else{
            const updateUser = await db.updateUser(userid, userinfo);
            if (updateUser)
            {
                return 1;
            }
            else{
                return 0;
            }
        // }
    
    },
    changeUserPassword: async (userid, userinfo)=>
    {
        const findUser = await db.findUserByID(userid);
        const oldPassword = findUser.password;
        let checkPass =   await bcrypt.compare(userinfo.current_password,oldPassword );
        if (checkPass === false)
        {
            return -1;//Mật khẩu không hợp lệ
        }
        else{
            const updateUser =  await db.updataUserPassword(userid,await bcrypt.hash(userinfo.password,10));
            //await db.updateUser(userid, userinfo);
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
    },
    findUserByUserName: async(username) =>
    {
        return await db.findUserByUserName(username)
    },
    findUserEmailToChangeInfo: async (id,email)=>
    {
       
        const data = await db.findUserByEmail(email);
        
        if (!data)
        {
            return true;
        }
        if (data.id ===id)
        {
            return true;
        }
       return false;
    },
    findUserNameToChangeInfo: async (id,username)=>
    {
       
        const data = await db.findUserByUserName(username);
        // console.log(data);
        if (!data)
        {
            return true;
        }
        if (data.id ===id)
        {
            return true;
        }
       return false;
    },
    insertImageProfile: async (result,user)=>{
        await imageDB.insertImageProfile(result,user)
    }

}