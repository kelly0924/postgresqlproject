const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const moment = require("moment")
const axios=require("axios")
const logFuntion=require("./logFun")

//  이미지를 업로드 하기 위한 것
const upload = require("./upload")
const AWS = require("aws-sdk");

//메모 보여주는 api 
router.post("/all",(req,res)=>{
    //token이 유효 한지 검사 
    const publicToken=req.headers.auth//프론트엔드에서 보내준 token
    axios.post("http://localhost:8000/verify", {
            token:publicToken
        })
        .then(function(response){
            console.log("token 인증:",response.data.success)
            if(response.data.success == true){//FE에서 보내준 토큰이 유용할 경우 databases를 조회 하고 보내주기
                //db 조회 하기 
                const db = new Client(pgInit)
                db.connect((err) => {
                    if(err) {
                        console.log(err)
                    }
                })
                const sql="SELECT * FROM memoschema.memo"
               
                db.query(sql,(err,row) =>{
                    console.log("검사"+ err) 
                    if(err){
                        console.log(err)
                    }
                     //loggin 남기기
                     const apiName=req.url
                     const reqHost=req.headers.host
                     const apiCallTime=moment(new Date().getTime())
                     //function으로 호출 하기 
                    logFuntion("userid",apiName,reqHost,row,apiCallTime)  
                    db.end()
                    res.send(row)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.
            
                })

            }else{
                res.send(response.data.message)//토큰이 잘 못 된 경우 사용 자에게 토큰이 잘 못 된것을 알려 줘야 한다. 
            }
            
        })
        .catch(function (error) {
            console.log(error)
        })
})

//메모 추가 하기 

router.post("/", (req,res)=>{
    
    const titleValue=req.body.title
    const contentsValue=req.body.contents
    const dateValue=req.body.writeDate
    const userValue=req.body.user


    const imgurlValue=req.body.imgUrl
    console.log(imgurlValue)

    //token을 사용 인증 
    const publicToken=req.headers.auth//프론트엔드에서 보내준 token
    axios.post("http://localhost:8000/verify", {
            token:publicToken
        })
        .then(function(response){
            console.log("token 인증:",response.data.success)
            if(response.data.success == true){//FE에서 보내준 토큰이 유용할 경우 databases를 조회 하고 보내주기
                const db = new Client(pgInit)
                const result={
                    "succeed":false
                }
                //디비 연결
                db.connect((err)=>{
                    if(err){
                        console.log(err)
                    }
                })
                const sql="INSERT INTO memoschema.memo (userid,memotitle,memocontents,imgurl,memodate) VALUES($1,$2,$3,$4,$5)"
                const valuses=[userValue,titleValue,contentsValue,imgurlValue,dateValue]
                db.query(sql,valuses,(err,row) =>{
                    if(!err){
                        result.succeed=true//프론트 엔드에게 성공 여부를 알려 준다.

                         //loggin 남기기
                         const apiName=req.url
                         const reqHost=req.headers.host
                         const apiCallTime=moment(new Date().getTime())
                         //function으로 호출 하기 
                         logFuntion("userid",apiName,reqHost,row,apiCallTime) 
                    }else{
                        console.log(err)
                    }
                   res.send(result)
                   db.end()
                })
            }else{
                res.send(response.data.message)//토큰이 잘 못 된 경우 사용 자에게 토큰이 잘 못 된것을 알려 줘야 한다. 
            }
        })
        .catch(function (error) {
            console.log(error)
        })
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

module.exports=router