const express = require('express');
const dotenv = require('dotenv')
const nodeMailer = require('nodemailer')
const app = express();
dotenv.config();
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    return res.render('index')
})
app.get("/mail/shot", (req, res)=>{
    const users = ['김태경', '김태인','주윤지', '장민정'];
    const arr = []
    for(let i = 0 ; i<users.length; i++){
        const mailOptions = {
            from: process.env.EMAIL,
            to: 'scd7896@gmail.com',
            subject: '김태경 얍 메일 테스트',
            html: `<img style="width:750px; height:150px;" src="cid:first_information"/>
                <h1>yapp에서 보냅니다 여러분</h1>
                <h3>hi ${users[i]}</h3>`,
            attachments :[{
                filename: 'first_information.png',
                path: __dirname+'/assets/first_information.png',
                cid: 'first_information'
            }]
        };    
        arr.push(mailOptions)
    }
    for(let i = 0 ; i<arr.length; i++){
        try{
            transporter.sendMail(arr[i], function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
        }catch{}
    }

    
    res.send(200, '메일 전송완료')
})
app.listen(9170 , () => console.log("서버 진행중 9170"));