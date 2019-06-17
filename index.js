const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const Twit = require('twit')
const bodyParser = require('body-parser')

const port = process.env.PORT || 5000
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))


const Twitter = new Twit({
    // consumer_key:         'R6BOuu278nj6MNhO30RRcqk0V',
    // consumer_secret:      'Lm57sTNLoNAnKSA4feedWa9fv7WtUA8bezMIYVE8KeYXpnNoe5',
    // access_token:         '1929845604-vpD60mSrz0s1QvLXyuzaacvkjRtzwY05xYWtxp6',
    // access_token_secret:  'W8QQcF8j5MnOXuVrX0TuX8b9Gbs7Uaer0PZ6dV6JYxcN0',
    consumer_key:         process.env.consumer_key,
    consumer_secret:      process.env.consumer_secret,
    access_token:         process.env.access_token,
    access_token_secret:  process.env.access_token_secret
})

app.get('/',(req,res)=>{
    
    res.render('home')
})

app.post("/sendtweet",(req,res)=>{
    console.log(req.body.tweet)
    if(req.body.tweet){
        (async ()=>{
            try {
                const data = await Twitter.post('statuses/update', { status: `${req.body.tweet}` })
                res.send(data)
            } catch (error) {
                res.send(error)
            }
           
        })()
    }else{
        res.send("error")
    }
    
})



app.listen(port,()=>{
    console.log(`Listening..............${port}`)
})