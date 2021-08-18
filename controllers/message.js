const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Init africastalking
const credentials = {
    apiKey: '7f042e8e88c0bf4afb6ac1f4a49e8556aaad31cefbe66eac766350bc3eed86b6',
    username: 'sandbox' // username is sandbox for sandbox applications
  }

const africastalking = require('africastalking')(credentials);

// initialize AT's SMS service
const sms = africastalking.SMS;


//create a message
router.post('/message', async (req, res)=> {
    const phoneNumber = req.body.recipient;
        const text = req.body.message;

    if(!phoneNumber || !text){
        return res.status(400).send('INVALID INPUTS');
    }
    
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
        
        await pool.query(
            "INSERT INTO messages (recipient, message) VALUES($1, $2) RETURNING *", 
             [recipient, message]
        );
        res.render('success');
    }catch(err){

        console.error(err.message);
    }
});

//get all messages
router.get('/messages', async (req, res) => {
   try{
    const Messages = await pool.query("SELECT msg_id, message, recipient, date_created FROM messages");
    const allMessages = Messages.rows;
    res.render('history', {allMessages});

   }catch(err){
    console.error(err.message);
   }
});


//Resend a message
router.get('/message/:id', async(req, res) => {
    
    try {
        const {id} = req.params;
        const newMessage = await pool.query("SELECT message, recipient FROM messages WHERE msg_id = $1", [id]);
        const messageObject = newMessage.rows[0];
        const phoneNumber = messageObject.recipient;
        const text = messageObject.message;
        console.log(phoneNumber);
        console.log(text);

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
            
            await pool.query(
                "INSERT INTO messages (recipient, message) VALUES($1, $2) RETURNING *", 
                 [recipient, message]
            );
            res.render('success');
        }catch(err){
    
            console.error(err.message);
        }
    
    } catch (err) {
        console.error(err.message);
    }
})

//Edit a message
router.get('/messages/:id/edit', async (req, res) => {
    try {
        const {id} = req.params;
        const message = await pool.query("SELECT message, recipient FROM messages WHERE msg_id = $1", [id]);
        const messageObject = message.rows[0];
        res.render('newIndex', {messageObject});
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;


