const express=require("express")
const session = require('express-session')


const app=express()//app은 experss를 객체로 만든것이 저장 된다. 실제로 사용할 것 
const port =8000
app.use(express.json()) // 해줘야 json을 읽고 보낼 수 있다. 
//세션 등록

app.use(session({
    secret: '1234',//세션 id를 생성 할때 사용하는 비밀 키
    resave: false,//세션에 변경이 있으면 저장 하겠다는 옵션이고 false 해서 불필요한 세션 저장 방지 하기 
    saveUninitialized: true,//
    cookie: { secure: false }//cooike secure 옵션은 웹브라우저와 웹서버가 https로 통신하는 것만 허용, 우린 http 로 하므로  이 옵션을 false 
}))

const pagesApi = require("./router/pages")//import 해준다.  외부로 분리 시킨 애를 import 한다.
app.use("/",pagesApi)//등록 (api 이름,내가 사용할 것)
//api 이름은 깊이를 가질 수 잇다.

const accountApi=require("./router/account")//import 하고 
app.use("/account",accountApi)//Import 한 api 를 등록 해줘야 한다. 

const memoApi=require("./router/memo")
app.use("/memo",memoApi)

const comentApi=require("./router/coment")
app.use("/coment",comentApi)



//mongoDB

const mongoApi=require("./dataBases/logApi")
app.use("/logAPi",mongoApi)

//upload file
const uploadApi=require("./router/uploadApi")
app.use("/upload",uploadApi)

// //세션 등록 여기다 하면 안됨 오류가 남: -- > 
// app.set('trust proxy', 1)
// app.use(session({
//     secret: '1234',//세션 id를 생성 할때 사용하는 비밀 키
//     resave: false,//세션에 변경이 있으면 저장 하겠다는 옵션이고 false 해서 불필요한 세션 저장 방지 하기 
//     saveUninitialized: true,//
//     cookie: { secure: false }//cooike secure 옵션은 웹브라우저와 웹서버가 https로 통신하는 것만 허용, 우린 http 로 하므로  이 옵션을 false 
// }))

app.listen(port,()=>{
    console.log(port + "번 포트에서 http통신을 시작!!")
})//http 통신을 시작 하겠다.(app.listen) port에서 듣겠다.  뒤에서 그래서 내가 http 통신을 시작 할 때 수행할 함수를 쓰겠다. 