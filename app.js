const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./models/db');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const port = 5000;
//Static files
app.use(express.static('./public'));
app.use('/css', express.static(__dirname + 'public/css'));

//Set templating engine
app.set('view engine', 'ejs');

//Middleware
app.use(cors());
app.use(express.json()); // to grab message body with req.body encoded as JSON
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));

// Init africastalking
const credentials = {
    apiKey: '7f042e8e88c0bf4afb6ac1f4a49e8556aaad31cefbe66eac766350bc3eed86b6',
    username: 'sandbox' // username is sandbox for sandbox applications
  }

const africastalking = require('africastalking')(credentials);

// initialize AT's SMS service
const sms = africastalking.SMS;

// Routes

// Will render the home page
app.get('/', (req, res) => {
    res.render('index');
    console.log('I am ready for action!!')
});

//create a message
app.post('/message', async (req, res)=> {
    const phoneNumber = req.body.recipient;
        const text = req.body.message;

// create const options with fields to, message and from
    const options = {
    to: phoneNumber,
    message: text,
    from: 'NAKO'
  }

  sms.send(options).then(info => {
    // return information from Africa's Talking
    console.log(info)
  }).catch(err => {
    console.log(err);
  });

    try{
        console.log(req.body);
        const {recipient, message} = req.body;
        
        const newMessage = await pool.query(
            "INSERT INTO messages (recipient, message) VALUES($1, $2) RETURNING *", 
             [recipient, message]
        );
        res.render('success');
        // res.json(newMessage.rows[0]);
    }catch(err){

        console.error(err.message);
    }
});

//get all message
app.get('/messages', async (req, res) => {
   try{
    const Messages = await pool.query("SELECT message FROM messages");
    const allMessages = Messages.rows;
     res.render('history', {allMessages});

   }catch(err){
    console.error(err.message);
   }
});

//get a message
app.get('/messages/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const message = await pool.query("SELECT * FROM messages WHERE msg_id = $1", [id]);
        res.json(message.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//update a message
app.put('/messages/:id', async (req, res) => {
    try {
        
        const {id} = req.params;
        const {recipient, message} = req.body;
        const updateMessage = await pool.query("UPDATE messages SET recipient = $1, message = $2 WHERE msg_id = $3", [recipient, message, id]);

        res.json('Message updated');
    } catch (err) {
        console.error(err.message);
    }
})

//create a template
app.post('/template', async (req, res)=> {
    try{
        console.log(req.body);
        const {recipient, message} = req.body;
        const newTemplate = await pool.query(
            "INSERT INTO templates (message, mobile_no) VALUES($1, $2) RETURNING *", 
             [message, recipient]
        );

        res.json(newTemplate.rows[0]);
    }catch(err){

        console.error(err.message);
    }
});


app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`)
});