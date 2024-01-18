const db = require("../db/db_user_helpers")
module.exports = {
    getUserByID: async(id)=>{
        const user = await db.findUserByID(id);
        console.log(user);
        return user;
    }
}