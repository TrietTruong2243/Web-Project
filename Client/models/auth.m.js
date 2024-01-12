const db = require("../db/db_user_helpers")
module.exports = {
    addNewUser: async(param)=>{
        console.log(param);
        const email = param.email_address;
        const userCheck = db.findUserByEmail(email);
        
        if (userCheck)
        {
            const addUser = db.addNewUser(param);
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