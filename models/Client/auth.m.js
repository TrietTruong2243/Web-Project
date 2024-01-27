const db = require("../../db/Client/db_user_helpers")
module.exports = {
    addNewUser: async (param) => {

        const email = param.email_address;
        const userCheck = await db.findUserByEmail(email);
        if (!userCheck) {
            const usernameCheck = await db.findUserByUserName(param.username);
            if (!usernameCheck) {
                const addUser = await db.addNewUser(param);
                if (addUser) {
                    return 1;

                }
                else {
                    return 0;

                }
            }
            else {
                return -2;
            }

        }
        else {

            return -1;
        }
    },
    getUserByID: async (id) => {
        const user = await db.findUserByID(id);
        return user;
    },
    getUserByEmail: async (email) => {
        const user = await db.findUserByEmail(email);
        return user;
    }
}