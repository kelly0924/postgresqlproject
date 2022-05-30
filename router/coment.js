const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const moment = require("moment")
const axios=require("axios")

router.post("/all",(req,res)=>{
    console.log("호출")
    const mid=req.body.num
    console.log(mid)
    const result={
        "contents": " ",
        "coment": " "
    }
   // console.log(mid) 

   //token이 유효 한지 검사 
   const publicToken=req.headers.auth//프론트엔드에서 보내준 token
   axios.post("http://localhost:8000/verify", {
           token:publicToken
       })
       .then(function(response){
        console.log("token 인증:",response.data.success)
        if(response.data.success == true){//FE에서 보내준 토큰이 유용할 경우 databases를 조회 하고 보내주기
            const db = new Client(pgInit)//데이터 베이스 사용을 위해 객체 하나를 생성 해준다. 
            db.connect((err) => {
                if(err) {
                    console.log(err)
                }
            })
            const sql="SELECT * FROM memoschema.memo WHERE memoid = $1"   
            const sqlcoment="SELECT * FROM memoschema.coment"

            const values=[mid]
            db.query(sql,values,(err,data) =>{
                console.log("검사"+ err) 
                if(err){
                    console.log(err)
                }
                result.contents=data
            })

            db.query(sqlcoment,(err,cdata) =>{
                console.log("검사"+ err) 
                if(err){
                    console.log(err)
                }
                result.coment=cdata
                db.end()
                res.send(result)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.
            })

            //axios로 api 호출 하기 
            const apiName="coment"//????
            const apiCallTime=getCurrentDate()
            const idValue="coment"

            axios.post("http://localhost:8000/logAPi",{
                userId:idValue,
                name:apiName,
                sendDate:result,
                time:apiCallTime
            })
            .then(function(response){
                console.log("axios",response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
        }else{
            res.send(response.data.me)
        }
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