const orderModel = require("../models/order.m");
module.exports = {
    listoforders: async (req, res) => {
        const id = req.user.id;
        const orders = await orderModel.getAllOrderOfUser(id);
        var jsonfile;

        jsonfile = `
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-lg-12 col-xl-11">
                    <div class="card text-black">
                        <div class="card-body p-md-5">
                            <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"><b>Order</b></p>
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-6 col-xl-6  order-lg-1">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
        res.json(jsonfile);
    },
}