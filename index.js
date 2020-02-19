const express = require('express');
const dotenv = require('dotenv')
dotenv.config();
const nodeMailer = require('nodemailer')
const app = express();
const fs = require('fs');
const XLSX = require('xlsx');
const allSheets = XLSX.readFile(__dirname + "/public/nodeexcel.xlsx")
const resultSheet = allSheets.Sheets['result']
const allUsers = [];
const allMemBerCount = process.env.ALL_MEMBER_COUNT

for(let i = 2 ; i<=allMemBerCount; i++){
    //시트 행 번호에 따른 정보
    /**
     *  H: 합격여부
     *  A: 이메일
     *  C: 이름
     */
    const isPass = resultSheet[`H${i}`] !== undefined && resultSheet[`H${i}`].v == '합격'
    const oneUser = {
        email: resultSheet[`A${i}`].v,
        name: resultSheet[`C${i}`].v,
        isPass: isPass
    }
    allUsers.push(oneUser)
}
console.log(allUsers)
app.set('view engine', 'ejs');

const targetImage = process.env.SECONDIMAGE


const makeMailOption = (pass, name, email,time = "")=>{
    if(pass){
        return {
            from: process.env.EMAIL,
            to: email,
            subject: 'YAPP 16기 최종 결과 안내',
            name : name,
            pass : pass,
            time,
            html: `<img style="width:750px; height:150px;" src="cid:first_information"/>
                <h2>안녕하세요 ${name}님, YAPP입니다.</h2>
                <h3>이번 YAPP 16기 최종합격이 되셨음을 기쁜 마음으로 알려드립니다!!!</h3>
                <p>모두 같이 열심히 지낼 수 있는 16기가 되었으면 좋겠습니다.</p>
                <br />
                <p>[YAPP 이메일주소 생성 규칙]</p>
                <p>규칙 : (닉네임).yapp@gmail.com</p>
                <p>이름 : 본인 이름 본명</p>
                <p>ex) test.yapp@gmail.com / gildong.yapp@gmail.com</p>
                <p>위 형식으로 메일을 생성하고 운영진에게 회신 해주시기 바랍니다</p>
                <br />
                <p>금일 저녁 중으로 단톡방으로 연락을 다시 드리겠습니다.</p>
                <p>감사합니다.</p>
                `,
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
            subject: 'YAPP 16기 최종 결과 안내',
            name : name,
            pass : pass,
            time,
            html: `<img style="width:750px; height:150px;" src="cid:first_information"/>
                <h3>안녕하세요 ${name}님, YAPP입니다</h3>
                <p>${name}께서는 안타깝게도 이번 YAPP16기 면접심사에 합격의 기쁜 소식을 전해드리지 못하게 되었습니다.</p>
                <p>비록 이번 활동에 함께 할 수 없게 되었지만,</p>
                <p>YAPP에 보내주신 관심에 감사드리며 추후 더 좋은 기회로 함께할 수 있길 바랍니다.</p>
                <p>YAPP 운영진 드림.</p>`,
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
    return res.status(200).send(allUsers)
})

app.get("/mail/shot", (req, res)=>{
    const arr = []
    
    for(let i = 0 ; i<allUsers.length; i++){
        let mailOptions;
        const targetIndex = passUsers.findIndex((el)=> el.email === allUsers[i].email)
        if( targetIndex !== -1){
            mailOptions =  makeMailOption(true, passUsers[targetIndex].name, passUsers[targetIndex].email, 0) // 1차때는 passUsers[targetIndex].time
            
        }else{
            mailOptions = makeMailOption(false, allUsers[i].name, allUsers[i].email, "")
        }
          
        arr.push(mailOptions);
    }
    for(let i = 0 ; i<arr.length; i++){
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
    res.status(200).send(arr)
})
app.listen(9170 , () => console.log("서버 진행중 9170"));