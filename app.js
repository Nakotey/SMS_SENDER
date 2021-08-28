require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./models/db');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const message = require('./controllers/message');
const template = require('./controllers/template');

const key = process.env.APIKEY;
const name = process.env.apiUsername;

const credentials = {
    apiKey: key,
    username: name
}

const africastalking = require('africastalking')(credentials);
const sms = africastalking.SMS;

const port = process.env.PORT || 5000;
//Static files
app.use(express.static('./public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use(expressLayouts);

//Set templating engine
app.set('view engine', 'ejs');

//Middleware
app.use(cors());
app.use(express.json()); // to grab message body with req.body encoded as JSON
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));
app.use('/', message);
app.use('/', template);

// Routes

// Will render the home/default page
app.get('/', (req, res) => {
    res.render('index');
    console.log('I am ready for action!!')
});



app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`)
});