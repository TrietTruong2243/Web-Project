const userModel = require("../models/user.m")
module.exports = {
    accountsettings: async (req, res) => {

        const id = req.user.id;
        const user = await userModel.getUserByID(id);
        console.log(user);
        var jsonfile;
        if (user.IsGoogleAccount === true) {
            jsonfile = `<div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-12 col-xl-11">
                <div class="card text-black">
                    <div class="card-body p-md-5">
                        <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"><b>ACCOUNT SETTINGS</b></p>
                        <div class="row justify-content-center">

                            <div class="col-md-10 col-lg-6 col-xl-6  order-lg-1">



                                <form class="mx-1 mx-md-4" action="/toHomePage" method="post">

                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Email
                                                Address</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="email_address" value="${user.Email || ""}" />
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Name</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="name" value="${user.CustomerName || ""}"/>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Phone
                                                number</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="phone_number"value="${user.PhoneNumber || ""}" />
                                        </div>
                                    </div>

                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Home
                                                Address</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="home_address" value="${user.HomeAddress || ""}" />
                                        </div>
                                    </div>

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
        else{
            jsonfile = `<div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-12 col-xl-11">
                <div class="card text-black">
                    <div class="card-body p-md-5">
                        <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"><b>ACCOUNT SETTINGS</b></p>
                        <div class="row justify-content-center">

                            <div class="col-md-10 col-lg-6 col-xl-6  order-lg-1">



                                <form class="mx-1 mx-md-4" action="/toHomePage" method="post">

                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Email
                                                Address</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="email_address" value="${user.Email || ""}" />
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Name</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="name" value="${user.CustomerName || ""}"/>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Phone
                                                number</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="phone_number"value="${user.PhoneNumber || ""}" />
                                        </div>
                                    </div>

                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example1c">Home
                                                Address</label>

                                            <input type="text" id="form3Example1c" class="form-control"
                                                name="home_address" value="${user.HomeAddress || ""}" />
                                        </div>
                                    </div>


                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example4c">Password</label>

                                            <input type="password" id="form3Example4c" class="form-control"
                                                name="password" />
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example4c">Password
                                                Confirm </label>

                                            <input type="password" id="form3Example4c" class="form-control"
                                                name="password_confirm" />
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <label class="form-label" for="form3Example4c">Current Password
                                            </label>

                                            <input type="password" id="form3Example4c" class="form-control"
                                                name="current_password" />
                                        </div>
                                    </div>
                                    <!-- <div class="col d-flex justify-content-center">
                                            Checkbox
                                            <div class="form-check">
                                                <input class="form-check-input" name="remember" type="checkbox"
                                                    id="form2Example31" checked="true" />
                                                <label class="form-check-label" for="form2Example31"> Remember me
                                                </label>
                                            </div>
                                        </div> -->


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
        res.json(jsonfile);
    }
}