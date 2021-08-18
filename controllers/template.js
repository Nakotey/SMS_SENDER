const express = require('express');
const router = express.Router();
const pool = require('../models/db');

//create a template
router.post('/template', async (req, res)=> {
    try{
        console.log(req.body);
        const {recipient, message} = req.body;
        await pool.query(
            "INSERT INTO templates (message, recipient) VALUES($1, $2) RETURNING *", 
             [message, recipient]
        );

        res.render('success');
    }catch(err){

        console.error(err.message);
    }
});

// get all templates
router.get('/templates', async (req, res) => {
    try{
     const templates = await pool.query("SELECT temp_id, message, recipient FROM templates");
     const allTemplates = templates.rows;
     res.render('template', {allTemplates});
 
    }catch(err){
     console.error(err.message);
    }
 });

 //resend a template message
 router.get('/message/:id', async(req, res) => {
    
    try {
        const {id} = req.params;
        const newMessage = await pool.query("SELECT message, recipient FROM templates WHERE temp_id = $1", [id]);
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
    
      }).catch(err => {
        console.log(err);
      });
    
        try{
            console.log(req.body);
            const {recipient, message} = req.body;
            
            await pool.query(
                "INSERT INTO templates (recipient, message) VALUES($1, $2) RETURNING *", 
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


 //Edit a template
 router.get('/templates/:id/edit', async (req, res) => {
    try {
        const {id} = req.params;
        const message = await pool.query("SELECT message, recipient FROM templates WHERE temp_id = $1", [id]);
        const messageObject = message.rows[0];
        res.render('newIndex', {messageObject});
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
