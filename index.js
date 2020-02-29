const express = require('express');
const dotenv = require('dotenv');
const app = express();
const fs = require('fs');
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io').listen(server)
dotenv.config();
const apiKey = process.env.API_KEY
var domain = process.env.DOMAIN;
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain, host: "api.eu.mailgun.net"});
app.use('/static',express.static(__dirname+'/dist'));



app.set('view engine', 'ejs');
const allUsers = [];
const completedUsers = [];

io.sockets.on('connection', function(socket){
    io.emit('list-add', completedUsers);
})

const sendUserResult = (user) =>{
    io.emit('list-add', user);
}

app.get('/', (req,res)=>{
    return res.render('index')
})
app.get('/usersTest',(req,res)=>{
    return res.status(200).send(allUsers)
})
app.get('/userlist', (req, res)=>{
    return res.render('listcheck')
})
app.get("/mail/shot", (req, res)=>{
    var data = {
        from: process.env.EMAIL,
        to: 'scd1212@naver.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
    };
    mailgun.messages().send(data, function (error, body) {
            
        console.log('에러',error)
        
        console.log('바디',body);
    });
})
app.listen(9170 , () => console.log("서버 진행중 9170"));