const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const cookieParser = require('cookie-parser')
const Twit = require('twit')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('express-flash')
const port = process.env.PORT || 5000
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
require('dotenv').config()
const Twitter = new Twit({
    consumer_key:         process.env.consumer_key,
    consumer_secret:      process.env.consumer_secret,
    access_token:         process.env.access_token,
    access_token_secret:  process.env.access_token_secret
})

app.get('/',(req,res)=>{
    
    res.render('home',{error: req.flash('error')})
})

app.post("/sendtweet",(req,res)=>{
    console.log(req.body.tweet)
    if(req.body.tweet){
        (async ()=>{
            try {
                const data = await Twitter.post('statuses/update', { status: `${req.body.tweet}` })
                req.flash('info', 'Flash Message Added');
                // res.send(data)
                res.redirect('/')
            } catch (error) {
                res.send(error)
            }
           
        })()
    }else{
        res.send("error")
    }
    
})

app.post('/do', (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body
  if (text == '') {
    // This is the first request. Note how we start the response with CON
    let response = `CON What would you want to check
    1. My Account
    2. My phone number`
    res.send(response)
  } else if (text == '1') {
    // Business logic for first level response
    let response = `CON Choose account information you want to view
    1. Account number
    2. Account balance`
    res.send(response)
  } else if (text == '2') {
    // Business logic for first level response
    let response = `END Your phone number is ${phoneNumber}`
    res.send(response)
  } else if (text == '1*1') {
    // Business logic for first level response
    let accountNumber = 'ACC1001'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your account number is ${accountNumber}`
    res.send(response)
  } else if (text == '1*2') {
    // This is a second level response where the user selected 1 in the first instance
    let balance = 'NGN 10,000'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your balance is ${balance}`
    res.send(response)
  } else {
    res.status(400).send('Bad request!')
  }
})

app.listen(port,()=>{
    console.log(`Listening..............${port}`)
})