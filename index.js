require('dotenv').config();
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const helpers = require('handlebars-helpers');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');

const CustomError = require('./helpers/customError');
const PassportMiddleware = require('./middlewares/passport');
const LocalsMiddleware = require('./middlewares/locals');
const ErrorHandlerMiddleware = require('./middlewares/errorHandler');
const db = require('./models');
// uncomment these line to create new tables and insert first admin
// db.sequelize.sync({ force: true })
// db.User.create({
//     username: 'admin',
//     email: 'abc@gmail.com',
//     password: '$2a$10$tLB8GqgbFjgF0iiGHdG0pOF/4gCo79dZOboRrjkfVjIJywYRgkCBe',
//     fullname: 'Admin',
//     role: 'admin'
// });

const port = process.env.PORT || 3000;
const app = express();
const router = require('./routes');

// cors
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}));

// method override
app.use(methodOverride('_method'));

// set view engine
app.engine("hbs", engine({ 
    extname: ".hbs",
    helpers: helpers(),
}));
app.set("view engine", "hbs");
app.set("views", "./views");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session, passport, locals
app.use(session ({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
PassportMiddleware(app);
app.use(LocalsMiddleware);

// routers
router(app);

// error handler
ErrorHandlerMiddleware(app);

// start server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// socket.io
// const io = require('socket.io')(server);
// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
//     socket.on('chat', (msg) => {
//         // io.emit("new-notification", data);
//         // socket.broadcast.emit("new-notification", data);
//         io.emit('chat', msg);
//     });
// });
