const appRouter = require("./app.r");
const authRouter = require("./auth.r")
const userRouter = require("./user.r")
const cartRouter = require("./cart.r")
const orderRouter = require("./order.r")
module.exports = (app) => {
    app.use('/', appRouter);
    app.use('/auth', authRouter)
    app.use("/user", userRouter)
    app.use("/order", orderRouter)
    app.use("/cart", cartRouter)

}