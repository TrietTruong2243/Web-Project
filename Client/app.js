require('dotenv').config()
const express= require('express');
const exphbs=require('express-handlebars');
const cors=require('cors');
const app= express();
const port= process.env.PORT;
const host= process.env.HOSt;
const bodyParser = require('body-parser');
// var path = require('path');
const appRouter = require("./routers/app.r");
const authRouter = require("./routers/auth.r")
const flash = require('express-flash');

// const cookieParser = require("cookie-parser");
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
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 10000},
    resave: false
    }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(cookieParser(secret));

// app.set('views', path.join(__dirname, '/Presentation/WebBrowserInterface'));
app.engine('hbs',exphbs.engine({
    extname:'.hbs',
    defaultLayout:'homepage.hbs',
    layoutsDir:"views/layouts",
}));
app.set('view engine','hbs');
app.use('/', appRouter);
app.use('/auth',authRouter)
app.listen(port,()=> console.log(`Server listening on port ${port}: http://${host}:${port}`));
 