const express = require('express');
const dotenv = require('dotenv');
const app = express();
const fs = require('fs')
dotenv.config();

const apiKey = process.env.API_KEY
var domain = process.env.DOMAIN;
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain, host: "api.eu.mailgun.net"});

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

app.set('view engine', 'ejs');
const allUsers = [];
const completedUsers = [];
const errorUsers = [];


app.get('/', (req,res)=>{
    return res.render('index')
})
app.get('/check/user', (req, res)=>{
    return res.render('check',{completedUsers : completedUsers, errorUsers : errorUsers})
})
app.get('/usersTest',(req,res)=>{
    return res.status(200).send(passUsers)
})

app.get("/mail/shot", (req, res)=>{
    mailgun.messages().send(data, function (error, body) {
        
        console.log('에러',error)
        console.log('바디',body);
    });
})
app.listen(9170 , () => console.log("서버 진행중 9170"));