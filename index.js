const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const http = require('http')
const server = http.Server(app)
const io = require('socket.io')(server, {
    cookie: false
})
const cors = require('cors');
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : true
}))
const XLSX = require('xlsx'); //엑셀파일 읽어오는 모듈
const allSheets = XLSX.readFile(__dirname + "/public/nodeexcel.xlsx") // 엑셀의 전체 시트를 읽자
const resultSheet = allSheets.Sheets['result'] // 그중에서 result 시트만 읽고
const allUsers = []; //보낼 전체유저 
const allMemBerCount = process.env.ALL_MEMBER_COUNT; //env에서 정의한 숫자
for(let i = 2 ; i<=allMemBerCount; i++){
    //시트 행 번호에 따른 정보
    /**
     *  H: 합격여부
     *  A: 이메일
     *  C: 이름
     */
    //합격 여부 확인해서 필요한 데이터 재가공
    const isPass = resultSheet[`H${i}`] !== undefined && resultSheet[`H${i}`].v == '합격'
    const oneUser = {
        email: resultSheet[`A${i}`].v,
        name: resultSheet[`C${i}`].v,
        isPass: isPass
    }
    allUsers.push(oneUser)
}


const apiKey = process.env.API_KEY // mailgun apiKey
var domain = process.env.DOMAIN; // mailgun domain
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain, host: "api.eu.mailgun.net"}); //mailgun 모듈

app.use('/static',express.static(__dirname+'/dist')); // react 쓰기위한 것
app.use(express.static(__dirname + '/'));
app.set('view engine', 'ejs'); // .env를 사용하기 위한 ejs



io.on('connection', function(socket){
})

const sendUserResult = (user, isError) =>{ // 메일 보내는 것 성공여부에 관계없이 결과를 프론트에 던져준다.
    const toClient = {
        ...user,
        isError
    }
    io.emit('list-add', toClient);
}
const createUserData = (user) => {
    return {
        from: process.env.EMAIL,
        to: 'yappsend@gmail.com',
        subject: `${user.name}의 결과물`,
        html: `
        <p>user의 이메일 : ${user.email}</p>
        <p>user의 이름 : ${user.name} </p>
        <p>합격 여부 : ${user.isPass} </p>
        `
    };
}

app.get('/', (req,res)=>{ // 단순 인덱스 페이지를 열어주는 web 라우터
    return res.render('index')
})

app.get('/sendmail', (req, res)=>{
    console.log('메일 전송 시작')
    for(let i = 0; i < 4; i++){
        const data = createUserData(allUsers[i]);
        const oneUser = allUsers[i];
        setTimeout(()=>{
            mailgun.messages().send(data, function (error, body) {
                if(error){
                    sendUserResult(oneUser, true);
                    return;
                }else{
                    sendUserResult(oneUser, false);
                    return;
                }
            });
        }, i * 1000)
    }
    return res.status(200).send(process.env.ALL_MEMBER_COUNT);
})

app.post("/resendmail", (req, res)=>{
    const list = req.body.list
    console.log(list);
    return res.status(200).send('good')
})

server.listen(9170 , () => console.log("서버 진행중 9170"));