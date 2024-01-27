require('dotenv').config()
const express= require('express');
const exphbs=require('express-handlebars');
const cors=require('cors');
const app= express();
const app1= express();
const port=3000;
const bodyParser = require('body-parser');
var path = require('path');
// const appRouter = require("./routers/Client/app.r");
// const authRouter = require("./routers/Client/auth.r")
// const userRouter = require("./routers/Client/user.r")
// const cartRouter =require("./routers/Client/cart.r")
// const orderRouter =require("./routers/Client/order.r")
// const adminRouter = require("./routers/Server/index")
const flash = require('express-flash');
const cookieParser = require("cookie-parser"); 


const session = require('express-session');
const { engine } = require('express-handlebars');
const helpers = require('handlebars-helpers');
const methodOverride = require('method-override');


const CustomError = require('./helpers/customError');
const PassportMiddleware = require('./middlewares/passport');
const LocalsMiddleware = require('./middlewares/locals');
const ErrorHandlerMiddleware = require('./middlewares/errorHandler');
const db = require('./models/Server');
const router = require('./routers/Server');
const router2 = require("./routers/Client/index.r")
// cors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(methodOverride('_method'));




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
    // cookie: { maxAge: 10000}, 
    resave: false
    }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.SECRET_KEY));
 ///TODO: uncomment these line to create new tables and insert first admin
// db.sequelize.sync({ force: true })
// db.User.create({
//     username: 'admin',
//     email: 'abc@gmail.com',
//     password: '$2a$10$tLB8GqgbFjgF0iiGHdG0pOF/4gCo79dZOboRrjkfVjIJywYRgkCBe',
//     fullname: 'Admin',
//     role: 'admin'
// });
// app.set('views', path.join(__dirname, './view/Client'));
app.engine('hbs',exphbs.engine({
    extname:'.hbs',
    // defaultLayout:'home.hbs',
    // layoutsDir:"views/layouts",
    helpers: helpers()

}));
app.set('view engine','hbs');
router2(app)
PassportMiddleware(app)
app.use(LocalsMiddleware)
router(app)
ErrorHandlerMiddleware(app);
// app.use('/',appRouter);
// app.use('/auth',authRouter) 
// app.use("/user", userRouter)
// app.use("/order", orderRouter)
// app.use("/cart", cartRouter)
// app.use("/admin", router )
app.listen(port,()=> console.log(`Server listening on port ${port}: http://localhost:3000`));
