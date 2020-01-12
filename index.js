const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.get('/', (req,res)=>{
    return res.render('view/index')
})

app.listen(9170 , () => console.log("서버 진행중 9170"));