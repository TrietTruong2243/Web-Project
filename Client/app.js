const express= require('express');
const exphbs=require('express-handlebars');
const cors=require('cors');
const app= express();
const port=3000;
const bodyParser = require('body-parser');
var path = require('path');
const appRouter = require("./routers/app.r");
const authRouter = require("./routers/auth.r")
const userRouter = require("./routers/user.r")
const cartRouter =require("./routers/cart.r")
const orderRouter =require("./routers/order.r")
const flash = require('express-flash');
require('dotenv').config()
const cookieParser = require("cookie-parser"); 
const session = require('express-session');
// const https = require('https');
// const secret = 'mysecretkey';
// const passport = require('passport');

// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()) // parse application/json
app.use(flash())
app.use(cors()); 
app.use(express.static(__dirname+'/public'));
app.use(session({ 
    secret: process.env.SECRET_KEY,
    saveUninitialized:true,
    cookie: { maxAge: 10000}, 
    resave: false
    }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.SECRET_KEY));
 
// app.set('views', path.join(__dirname, '/Presentation/WebBrowserInterface'));
app.engine('hbs',exphbs.engine({
    extname:'.hbs',
    defaultLayout:'homepage.hbs',
    layoutsDir:"views/layouts",
}));
app.set('view engine','hbs');
app.use('/',appRouter);
app.use('/auth',authRouter) 
app.use("/user", userRouter)
app.use("/order", orderRouter)
app.use("/cart", cartRouter)
app.listen(port,()=> console.log(`Server listening on port ${port}: http://localhost:3000`));
 
