const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./models/db');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const message = require('./controllers/message');
const template = require('./controllers/template');

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

// Init africastalking
const credentials = {
    apiKey: '7f042e8e88c0bf4afb6ac1f4a49e8556aaad31cefbe66eac766350bc3eed86b6',
    username: 'sandbox' // username is sandbox for sandbox applications
  }

const africastalking = require('africastalking')(credentials);

// initialize AT's SMS service
const sms = africastalking.SMS;

// Routes

// Will render the home/default page
app.get('/', (req, res) => {
    res.render('index');
    console.log('I am ready for action!!')
});



app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`)
});