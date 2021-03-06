const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다. 
const logFuntion=require("./logFun")
const moment = require("moment")
const axios=require("axios")
const cookie = require("cookie")//쿠키 사용
const jwt=require("jsonwebtoken")//jwt token 사용
const redis=require("redis").createClient()//redis를 사용하기 위한 import
const redisView=require("../function/redisViewuser")
const redisviewCnt=require("../function/redisViewCount")

const secretKey="qwwdfdlfdjfkafhaeseongjhioerhhwadnelasdjefdofdnjflgdjf"
const redisKey="loginCount"

router.post("/",async(req,res)=>{
  //사용자로 부터 입력 받은 값
    const idValue= req.body.id
    const pwValue= req.body.pw

    //프론트 엔드로 보내 줄값 json으로 받았으니까 json으로 보내 줄것이다. 
    const result ={//프론트 엔드에게 보내 줄 값, 로그인 성공 여부, 발급된 토큰, 토큰 발급 도중 에로가 나면 에로 메세지
        "sucess":false,
        "token":"",
        "message": null,
    }//로그인 한 회원수 출력 

    //db 연결
    const db = new Client(pgInit)
    db.connect((err) => {
        if(err) {
            console.log(err)
        }
    })
    const sql="SELECT * FROM  memoschema.user WHERE userid=$1 and userpw=$2"
    const values=[idValue,pwValue]

    db.query(sql,values,(err,data) =>{//이것 때문?
        console.log("검사"+ err) 
        if(!err){

            const row=data.rows;
            redisView(idValue)//id 값을 입력을 받도록 하는 함수 -> id를 redis추가 하는 함수  중복 불가 sAdd(divalue)
            redisviewCnt(idValue)//id 입력 받는다. 중복 가능 redis set(idvalue) 해준다.

            if(row.length == 0){
            }else {
                //토큰 생성
                console.log("들어 오나")
                const jwtToken=jwt.sign(
                    {
                        "id":idValue,
                        "pw":pwValue//q
                    },
                    secretKey,
                    {
                        "issuer": "coco",// 발급자 메모용
                        "expiresIn":"1m" //토큰 완료 시간
                    }
                )
                result.token=jwtToken
                result.sucess=true      
            }
            // 로고 남기기 
            const apiName=req.url
            const reqHost=req.headers.host
            const apiCallTime=moment(new Date().getTime())
            //function으로 호출 하기 
            logFuntion(idValue,apiName,reqHost,row,apiCallTime)   
            
        }else {
            console.log(err)
        }
        db.end()
        res.send(result)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.
    })
})

//방문자 회원수 api-> 회원이 여러번 로그인 해도 그 회원 수는 한명이므로 1로 된다 중복 불가
router.get("/viewuser",async(req,res)=>{
  
    const result={
        "viewUser":0,
        "message":null
    }
    
    try{
        //redis 연결 
        await redis.connect()
        //login 한 사용자 수를 저장 하기 위한 redis --> 중복 횟수 중가 안됨
        result.viewUser=await redis.sMembers("userCount")
        await redis.disconnect()//연결된 redis 연결 끊기 

    }catch(err){
        console.log("reids:",err)
        result.message=err
        res.send(result)
    }
    
    res.send(result)

})
//로그인 하고 방문한 번수를 출력 하는 api 
router.get("/viewconuter",async(req,res)=>{
  
    const result={
        "viewCount":0,
        "message":null
    }
    
    try{
        //redis 연결 
        await redis.connect()
        //로그인 한 수 -> 한명이 하루에 여러번 가능 중복 가능
        const loginCounter= await redis.get(redisKey)
        result.viewCount=loginCounter
        await redis.disconnect()//연결된 redis 연결 끊기 

    }catch(err){
        console.log("reids:",err)
        result.message=err
        res.send(result)
    }
    
    res.send(result)

})


//회원 가입
router.post("/signUp",(req,res)=>{
    const idValue=req.body.id
    const pwValue=req.body.pw
    const signDate=req.body.signupDate

    console.log("로그인 요청 정보 확인",req.url)

    const db = new Client(pgInit)

    console.log(idValue,pwValue,signDate)
    const result={
        "succeed":false
    }

    db.connect((err)=>{
        if(err){
            console.log(err)
        }
    })
    const sql="INSERT INTO memoschema.user (userid,userpw,signupdate) VALUES($1,$2,$3)"
    const valuses=[idValue,pwValue,signDate]
    db.query(sql,valuses,(err,rows) =>{
        if(!err){
            result.succeed=true
            console.log(rows)
        }else{
            console.log(err)
        }
       
       
       //loggin 남기기
        const apiName=req.url
        const reqHost=req.headers.host
        const apiCallTime=moment(new Date().getTime())
        //function으로 호출 하기 
        logFuntion(idValue,apiName,reqHost,rows,apiCallTime)

        res.send(result)
       db.end()
    })
   
})


//회원 가입

router.post("/signUp",(req,res)=>{
    const idValue=req.body.id
    const pwValue=req.body.pw
    const signDate=req.body.signupDate
    const rediskey=idValue+"word"

    console.log("로그인 요청 정보 확인",req.url)

    const db = new Client(pgInit)

    console.log(idValue,pwValue,signDate)
    const result={
        "succeed":false
    }

    db.connect((err)=>{
        if(err){
            console.log(err)
        }
    })
    const sql="INSERT INTO memoschema.user (userid,userpw,signupdate) VALUES($1,$2,$3,$4)"
    const valuses=[idValue,pwValue,signDate,redisKey]
    db.query(sql,valuses,(err,rows) =>{
        if(!err){
            result.succeed=true
            console.log(rows)
        }else{
            console.log(err)
        }
        
        
        //loggin 남기기
        const apiName=req.url
        const reqHost=req.headers.host
        const apiCallTime=moment(new Date().getTime())
        //function으로 호출 하기 
        logFuntion(idValue,apiName,reqHost,rows,apiCallTime)

        res.send(result)
        db.end()
    })
    
})


//서버에서 토큰의 유효성을 검증 해주는 API 이다. 로그인을 하기 전에 token을 검증 해주는 api 
router.post("/verify",(req,res)=>{
const token=req.headers.auth//프론트엔드에서 보내준 token
const result={
    "success":false,
    "message":null
}
try{
    jwt.verify(token,secretKey)//서버가 가지고 있는 secretKey로 검증한다.
    result.success=true
    res.send(result)
}catch(e){
    result.message="토큰이 잘못 됬음"
    res.send(result)
}
})

const getCurrentDate=()=>{
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var today = date.getDate();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
return new Date(Date.UTC(year, month, today, hours, minutes, seconds));
}

module.exports=router//

// module.exports=router,{router}//무조건 router로 해달라 여러개 해달라 