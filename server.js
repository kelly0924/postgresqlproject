const express=require("express")
const cookieParser = require("cookie-parser");


const app=express()//app은 experss를 객체로 만든것이 저장 된다. 실제로 사용할 것 
const port =8000
app.use(express.json()) // 해줘야 json을 읽고 보낼 수 있다. 

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

//쿠키 등록 해주기 -- > 등록 해주므로서  response request로 사용 가능
app.use(cookieParser())

//토큰의 인증을 위한 api 
const verifyApi=require("./router/auth")
app.use("/verify",verifyApi) 

//redis 등록
const searchWordApi=require("./router/search")
app.use("/search",searchWordApi)

//elasticsearch
const elasticAip=require("./router/elasticSearch")
app.use("/elastic",elasticAip)

app.listen(port,()=>{
    console.log(port + "번 포트에서 http통신을 시작!!")
})//http 통신을 시작 하겠다.(app.listen) port에서 듣겠다.  뒤에서 그래서 내가 http 통신을 시작 할 때 수행할 함수를 쓰겠다. 