const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const moment = require("moment")
const axios=require("axios")


//메모 보여주는 api 
router.get("/all",(req,res)=>{
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

        //axios로 api 호출 하기 
        const apiName="login"//????
        const apiCallTime=getCurrentDate()
        axios.post("http://localhost:8000/logAPi",{
            userId:"if session userid",
            name:apiName,
            sendDate:row.rows,
            time:apiCallTime
        })
        .then(function(response){
            console.log("axios",response.data)
        })
        .catch(function (error) {
            console.log(error)
        })

        db.end()
        res.send(row)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.

    })
    //프론드에게 값을 반환
   //db.end() 위에 것랑 같이 돌아 가서 미리 끝나 버린다. 
})

//메모 추가 하기 

router.post("/",(req,res)=>{
    // router.post("/",(req,res)=>{
    const titleValue=req.body.title
    const contentsValue=req.body.contents
    const dateValue=req.body.writeDate
    const userValue=req.body.user

    const db = new Client(pgInit)
    const result={
        "succeed":false
    }

    db.connect((err)=>{
        if(err){
            console.log(err)
        }
    })

    //img url 을 얻어서 디비에 저장 하기 

    // axios.get("http://localhost:8000/upload")
    //     // upload 하는 api 를 호출 하여 api 가 보내주는 값을 가져 올 것이다. 
    //     .then(function(response){
    //         console.log("axios",response)
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //     })


    const sql="INSERT INTO memoschema.memo (userid,memotitle,memocontents,memodate) VALUES($1,$2,$3,$4)"
    const valuses=[userValue,titleValue,contentsValue,dateValue]
    db.query(sql,valuses,(err,row) =>{
        if(!err){

            result.succeed=true
           //axios로 api 호출 하기 
           const apiName="login"//????
           const apiCallTime=getCurrentDate()
           axios.post("http://localhost:8000/logAPi",{
            userId:userValue,
            name:apiName,
            sendDate:row.rows,
            time:apiCallTime
            })
            .then(function(response){
                console.log("axios",response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
        }else{
            console.log(err)
        }

       res.send(result)
       db.end()
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

module.exports=router//