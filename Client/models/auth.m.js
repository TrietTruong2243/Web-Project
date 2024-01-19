const db = require("../db/db_user_helpers")
module.exports = {
    addNewUser: async(param)=>{
      
        const email = param.email_address;
        const userCheck = await db.findUserByEmail(email);
        console.log(userCheck);
        if (!userCheck)
        {
            const addUser = await db.addNewUser(param);
            if (addUser)
            {
                return 1;

            }
            else 
            {
                return 0;

            }
        }
        else{
            return -1;
        }
    }
}