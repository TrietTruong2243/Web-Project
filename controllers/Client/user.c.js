const { response } = require("express");
const userModel = require("../../models/Client/user.m")
var { validationResult } = require('express-validator');
const cloudinary = require('../../config/cloudinary');
const toDataUri = require('../../helpers/dataUriConverter');

module.exports = {
    accountsettings: async (req, res) => {
        const id = req.user.id;

        const user = await userModel.getUserByID(id);
    
        var jsonfile;
        if (user.isGGAcc === true) {
            jsonfile = `<div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-12 col-xl-11">
                <div class="card text-black">
                    <div class="card-body p-md-5">
                        <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"><b>ACCOUNT SETTINGS</b></p>
                        <div class="row justify-content-center">

                            <div class="col-md-10 col-lg-6 col-xl-6  order-lg-1">
                            <div class="d-flex flex-row align-items-center mb-4">
                           
                        </div>

                        <div >
                        <form  action="/user/changeimageprofile" method="post" enctype="multipart/form-data">
                               <h5 class="mt-0"><b>Profile photo</b></h5>
                               <div class="text-center">
                                   <img id="previewImage" src="${user.image}" initUrl = "${user.image}"alt="avatar" class="d-block m-auto enlarge-image image-has-modal">
                                   <input type="file" id="image" name="image" hidden>
                                   <label class="btn btn-sm mt-2 btn-primary" for="image">Upload</label>
                                   <button class="btn btn-sm mt-2 btn-danger" id="removeImageBtn">Remove</button>
                               </div>
                               <button type="submit"  id="saveImg"
                               class="btn btn-lg btn-dark btn-block mb-2 m-1">SAVE IMAGE   </button>           
                         </form>
                   </div>
                                <form class="mx-1 mx-md-4" id = "gguserinfo" method="post" enctype="multipart/form-data">
                                
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Email
                                                Address</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="email_address" value="${user.email || ""}" readonly />
                                                <h4 style="color:red" id="email_err"> Cannot change email because this is Google Account</h4>

                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                    <i class="fas fa-user fa-lg me-3 fa-fw"></i>

                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Username</label>

                                                <input type="text" id="form3Example1c" class="form-control" name="username" value="${user.username || ""}"/>
                                                <h4 style="color:red" id="username_err"></h4>

                                            </div>
                                        </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Name</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="name" value="${user.fullname || ""}"/>
                                                <h4 style="color:red" id="name_err"></h4>

                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Phone
                                                number</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="phone_number"value="${user.phone || ""}" />
                                                <h4 style="color:red" id="phone_number_err"></h4>

                                        </div>
                                    </div>

                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Home
                                                Address</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="home_address" value="${user.address || ""}" />
                                                <h4 style="color:red" id="home_address_err"></h4>

                                        </div>
                                    </div>
                                    <h2 style="color:green; font: size 20px;" id="success">
                                    </h2>
                                    <h2 style="color:red; font: size 20px;" id="err">
                                    </h2>
                                    <!-- Submit button -->
                                    <button type="submit"
                                        class="btn btn-lg btn-dark btn-block mb-2 m-1">UPDATE
                                        DETAILS</button>
                                    <!-- <div class="text-center"><a href="">Forgot your password?</a></div>
                                        <button class="btn btn-lg btn-block btn-primary mb-4"
                                            style="background-color: #3b5998;" type="submit"><i
                                                class="fab fa-facebook-f me-2"></i>Sign in with facebook</button> -->
                                    <!-- Register buttons -->
                                    <div class="text-center">
                                        <!-- <p>Not a member? <a href="/toRegister">Register</a></p> -->

                                        <button type="button" class="btn btn-link btn-floating mx-1">
                                            <i class="fab fa-facebook-f"></i>
                                        </button>

                                    </div>

                                </form>

                            </div>



                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>`
        }
        else {
            jsonfile = `<div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-lg-12 col-xl-11">
                    <div class="card text-black">
                        <div class="card-body p-md-5">
                            <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"><b>ACCOUNT SETTINGS</b></p>

                            <div class="row justify-content-center">

                                <div class="col-md-10 col-lg-6 col-xl-6  order-lg-1">
                                    
                                <div >
                                <form  action="/user/changeimageprofile" method="post" enctype="multipart/form-data">
                                       <h5 class="mt-0"><b>Profile photo</b></h5>
                                       <div class="text-center">
                                           <img id="previewImage" src="${user.image}" initUrl = "${user.image}" alt="avatar" class="d-block m-auto enlarge-image image-has-modal">
                                           <input type="file" id="image" name="image" hidden>
                                           <label class="btn btn-sm mt-2 btn-primary" for="image">Upload</label>
                                           <button class="btn btn-danger btn-sm mt-2" id="removeImageBtn">Remove</button>
                                       </div>
                                       <button type="submit" id="saveImg"
                                       class="btn btn-lg btn-dark btn-block mb-2 m-1" >SAVE IMAGE   </button>           
                                 </form>
                           </div>
                                    <form class="mx-1 mx-md-4" id = "userinfo" method="post" enctype="multipart/form-data">
                                    
                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Email
                                                    Address</label>

                                                    <input type="text" id="form3Example1c" class="form-control"
                                                    name="email_address" value="${user.email || ""}" />
                                                    <h4 style="color:red" id="email_err"></h4>

                                            </div>
                                        </div>
                                        <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>

                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Username</label>

                                                <input type="text" id="form3Example1c" class="form-control" name="username" value="${user.username || ""}"/>
                                                <h4 style="color:red" id="username_err"></h4>

                                            </div>
                                        </div>
                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Fullname</label>

                                                <input type="text" id="form3Example1c" class="form-control"
                                        name="name" value="${user.fullname || ""}"/>
                                                    <h4 style="color:red" id="name_err"></h4>

                                            </div>
                                        </div>
                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Phone
                                                    number</label>

                                                    <input type="text" id="form3Example1c" class="form-control"
                                                    name="phone_number"value="${user.phone || ""}" />
                                                    <h4 style="color:red" id="phone_number_err"></h4>

                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Home
                                                    Address</label>

                                                    <input type="text" id="form3Example1c" class="form-control"
                                                    name="home_address" value="${user.address || ""}" />
                                                    <h4 style="color:red" id="home_address_err"></h4>

                                            </div>
                                        </div>


                                        <h2 style="color:green; font: size 20px;" id="success">
                                        </h2>
                                        <h2 style="color:red; font: size 20px;" id="err"></h2>

                                        <!-- Submit button -->
                                        <button type="submit"
                                            class="btn btn-lg btn-dark btn-block mb-2 m-1">UPDATE
                                            DETAILS</button>
                                            
                                        <!-- Register buttons -->
                                        <div class="text-center">
                                            <!-- <p>Not a member? <a href="/toRegister">Register</a></p> -->

                                            <button type="button" class="btn btn-link btn-floating mx-1">
                                                <i class="fab fa-facebook-f"></i>
                                            </button>

                                        </div>

                                    </form>

                                </div>
                            </div>
                            

                            <div class="row justify-content-center">

                                <div class="col-md-10 col-lg-6 col-xl-6  order-lg-1">



                                    <form class="mx-1 mx-md-4" id="changepass" method="post">
                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4c">Password</label>

                                                <input type="password" id="form3Example4c" class="form-control"
                                                name="password" />
                                                <h4 style="color:red" id="pw_err"></h4>

                                            </div>

                                        </div>
                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4c">Password
                                                    Confirm </label>

                                                <input type="password" id="form3Example4c" class="form-control"
                                                    name="password_confirm" />
                                                    <h4 style="color:red" id="pw_confirm_err"></h4>

                                            </div>
                                        </div>
                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4c">Current Password
                                                </label>

                                                <input type="password" id="form3Example4c" class="form-control"
                                                    name="current_password" />
                                                    <h4 style="color:red" id="pw_current_err"></h4>

                                            </div>
                                        </div>
                                        <h2 style="color:green; font: size 20px;" id="PassSuccess">
                                        </h2>
                                        <h2 style="color:red; font: size 20px;" id="PassErr"></h2>
                                        <!-- Submit button -->
                                        <button type="submit"
                                            class="btn btn-lg btn-dark btn-block mb-2 m-1">CHANGE
                                            PASSWORD</button>
                                        <!-- <div class="text-center"><a href="">Forgot your password?</a></div>
                                            <button class="btn btn-lg btn-block btn-primary mb-4"
                                                style="background-color: #3b5998;" type="submit"><i
                                                    class="fab fa-facebook-f me-2"></i>Sign in with facebook</button> -->
                                        <!-- Register buttons -->
                                        <div class="text-center">
                                            <!-- <p>Not a member? <a href="/toRegister">Register</a></p> -->

                                            <button type="button" class="btn btn-link btn-floating mx-1">
                                                <i class="fab fa-facebook-f"></i>
                                            </button>

                                        </div>

                                    </form>

                                </div>



                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>`
        }
        res.json(jsonfile);
    },
    accountorders: async (req, res) => {
        const id = req.user.id;
        console.log(id);
        const orders = await userModel.getAllOrderOfUser(id);
        console.log(orders);
        res.json({ orders: orders });
    },
    changeUserInfo: async (req, res) => {
        var err1 = validationResult(req);
        console.log(req);
        const userID = req.user.id;

        if (err1.errors.length) {
            res.json({ err: err1.errors })
        }
        else {
            const checkEmail = await userModel.findUserEmailToChangeInfo(userID, req.body.email_address)
            if (checkEmail == false) {
                return res.json({ addErr: "Email already exists!" });

            }
            const checkUsername = await userModel.findUserNameToChangeInfo(userID, req.body.username)
            if (checkUsername == false) {
                return res.json({ addErr: "Username already exists!" });

            }
            const changeUserInfo = await userModel.changeUserInfo(userID, req.body);
            var err;
            switch (changeUserInfo) {


                case 0:
                    err = "There was an error, the information cannot be edited!"
                    break;
                case 1:
                    break;
            }
            if (err) {
                res.json({ addErr: err });

            } else {
                res.json({ success: "Edited information successfully!" })
            }


        }
    },
    changeUserPassword: async (req, res) => {
        var err1 = validationResult(req);

        const userID = req.user.id;

        if (err1.errors.length) {
            res.json({ err: err1.errors })
        }
        else {
            const changeUserInfo = await userModel.changeUserPassword(userID, req.body);
            var err;
            switch (changeUserInfo) {
                case -1:
                    err = "The current password does not match the old password!"
                    break;

                case 0:
                    err = "Error, cannot change password!"
                    break;
                case 1:
                    break;
            }
            if (err) {
                res.json({ addErr: err });

            } else {
                res.json({ success: "Password change successful!" })
            }
        }
    },
    changeGGUserInfo: async (req, res) => {
        var err1 = validationResult(req);
        console.log(req);
        const userID = req.user.id;

        if (err1.errors.length) {
            res.json({ err: err1.errors })
        }
        else {
            const checkUsername = await userModel.findUserNameToChangeInfo(userID, req.body.username)
            if (checkUsername == false) {
                return res.json({ addErr: "Username already exists, cannot be changed!" });

            }
            const changeUserInfo = await userModel.changeGGUserInfo(userID, req.body);

            // const addUser = await model.addNewUser(req.body);
            var err;
            switch (changeUserInfo) {

                case 0:
                    err = "There was an error, the information cannot be edited!"
                    break;
                case 1:
                    break;
            }
            if (err) {
                res.json({ addErr: err });

            } else {
                res.json({ success: "Edited information successfully!" })
            }

        }


    },
    addGGUserInfo: async (req, res) => {
        var err1 = validationResult(req);
        const email = req.cookies['email'];
        const user = await userModel.getUserByEmail(email);
        const userID = user.id;
        if (err1.errors.length) {
            res.json({ err: err1.errors })
        }
        else { 
            const checkUsername = await userModel.findUserNameToChangeInfo(userID, req.body.username)
            if (checkUsername == false) {
                return res.json({ addErr: "Username already exists, cannot be added!" });

            }
            const changeUserInfo = await userModel.changeGGUserInfo(userID, req.body);

            // const addUser = await model.addNewUser(req.body);
            var err;
            switch (changeUserInfo) {

                case 0:
                    err = "There was an error, the information cannot be edited!"
                    break;
                case 1:
                    break;
            }
            if (err) {
                res.json({ addErr: err });

            } else {
                res.json({ success: "Added information successfully!" })
            }

        }


    },
    changeImageProfile: async(req,res)=>{
        const image = req.file;
        console.log(req.user);
        if (image) {
            const imageDataUri = toDataUri(image);
            const result = await cloudinary.uploader.upload(imageDataUri, {
                folder: 'HCMUS-Ecommerce/users'
            });
            //insert image to database
            await userModel.insertImageProfile(result,req.user);
            // const newImage = await Image.create({
            //     url: result.secure_url,
            //     public_id: result.public_id,
            //     userId: user.id
            // });
            // console.log(newImage);
        }
        res.redirect("/auth/userinfo");
    }
}