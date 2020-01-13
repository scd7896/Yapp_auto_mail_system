const express = require('express');
const dotenv = require('dotenv')
const nodeMailer = require('nodemailer')
const app = express();
const fs = require('fs')
dotenv.config();
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTHUSER1,
      pass: process.env.PASSWORD
    }
});
const transporter2 = nodeMailer.createTransport({
    service : 'gmail',
    auth : {
        user: process.env.AUTHUSER2,
        pass : process.env.PASSWORD
    }
})
app.set('view engine', 'ejs');
const allUsers = [];
const passUsers = [];
const completedUsers = [];
const errorUsers = [];
const targetImage = process.env.FIRSTIMAGE
const fileHandling = ()=>{
    
    const allUserName = fs.readFileSync(__dirname+'/datas/allname.txt').toString().split('\n');
    const allUserEmail = fs.readFileSync(__dirname+'/datas/allemail.txt').toString().split('\n');
    const passUserName = fs.readFileSync(__dirname+'/datas/passname.txt').toString().split('\n');
    const passUserEmail = fs.readFileSync(__dirname+'/datas/passemail.txt').toString().split('\n');
    const passUserTime = fs.readFileSync(__dirname+'/datas/passtime.txt').toString().split('\n');
    for(let i = 0 ; i<allUserName.length; i++){
        const keyEmail = allUserEmail[i]
        const valueName = allUserName[i];
        allUsers.push({email : keyEmail, name : valueName})
    }
    for(let i = 0 ; i<passUserName.length; i++){
        const keyEmail = passUserEmail[i]
        const valueName = passUserName[i];
        const passTime = passUserTime[i]
        passUsers.push({email : keyEmail, name : valueName, time : passTime})
    }
}
fileHandling();

const makeMailOption = (pass, name, email,time = "")=>{
    if(pass){
        return {
            from: process.env.EMAIL,
            to: email,
            subject: '합격 메일 테스트',
            name : name,
            pass : pass,
            time,
            html: `<img style="width:750px; height:150px;" src="cid:first_information"/>
                <h1>yapp에서 보냅니다 여러분</h1>
                <h3>hi ${name}</h3>
                <h4>${email}</h4>
                <p>귀하의 합격을 축하합니다</p>
                <p>${time}까지 와주시기 바랍니다</p>
                <p>약도입니다</p>
                <img style = "450px; 450px; src="cid:interview_place" />`,
            attachments :[{
                filename: targetImage,
                path: __dirname+'/assets/'+targetImage, //이미지
                cid: 'first_information'
            }, {
                filename : process.env.INTERVIEWPLACE,
                path : __dirname+'/assets/'+process.env.INTERVIEWPLACE,
                cid : "interview_place"
            }]
        }; 
    }else{
        return {
            from: process.env.EMAIL,
            to: email,
            subject: '불합격 메일 테스트',
            name : name,
            pass : pass,
            time,
            html: `<img style="width:750px; height:150px;" src="cid:first_information"/>
                <h1>yapp에서 떨어짐을 알려드립니다</h1>
                <h3>hi ${name}</h3>
                <h4>${email}</h4>
                <p>귀하의 불합격을 매우 유감스럽게 생각합니다</p>
                <p>${time}까지 와주시기 바랍니다</p>`,
            attachments :[{
                filename: targetImage,
                path: __dirname+'/assets/'+targetImage, //이미지 경로입니다
                cid: 'first_information'
            }]
        }; 
    }
}

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
    const arr = []
    
    for(let i = 0 ; i<allUsers.length; i++){
        let mailOptions;
        const targetIndex = passUsers.findIndex((el)=> el.email === allUsers[i].email)
        if( targetIndex !== -1){
            mailOptions =  makeMailOption(true, passUsers[targetIndex].name, passUsers[targetIndex].email, passUsers[targetIndex].time)
            
        }else{
            mailOptions = makeMailOption(false, allUsers[i].name, allUsers[i].email, "")
        }
          
        arr.push(mailOptions);
    }
    for(let i = 0 ; i<98; i++){
        try{
            setTimeout(()=>{
                transporter.sendMail(arr[i], function(error, info){
                    if (error) {
                        console.log('error', arr[i].name)
                        errorUsers.push(arr[i]);
                    } else {
                        completedUsers.push(arr[i])
                    }
                });                    
            }, [i * 1000]);
        }catch{}
    }
    for(let i = 98; i<arr.length; i++){
        try{
            setTimeout(()=>{
                transporter2.sendMail(arr[i], function(error, info){
                    if (error) {
                        console.log('error', arr[i].name)
                        errorUsers.push(arr[i])
                    } else {
                        completedUsers.push(arr[i])
                    }
                });                    
            }, [i * 1000]);
        }catch{}
    }
    res.status(200).send(arr)
})
app.listen(9170 , () => console.log("서버 진행중 9170"));