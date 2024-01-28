const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("hbs", engine({
    extname: ".hbs",
    helpers: Handlebars.registerHelper('eq', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }),
}));
app.set("view engine", "hbs");
app.set('views', './views');
const ctrl = require('./controllers')


app.post('/api/create-account', ctrl.createPaymentAccount);
app.get('/api/check-account', ctrl.checkAccount);
app.post('/api/payment', ctrl.postPayment);
app.get('/api/balance/:userId', ctrl.getUserBalance);
app.get('/', (req, res) => {
    res.render('home', {
        layout: false
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({msg: 'Something broke!', err: err.stack})
});
app.listen(5000, () => console.log('Server started: http://localhost:5000'));