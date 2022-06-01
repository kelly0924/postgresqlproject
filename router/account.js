const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다. 
const logFuntion=require("./logFun")
const moment = require("moment")
const axios=require("axios")

router.post("/",(req,res)=>{
    //프론트엔드로 부터 받아온 값
    const idValue= req.body.id
    const pwValue= req.body.pw
    const reqHost=req.headers.host
    //프론트 엔드로 보내 줄값 json으로 받았으니까 json으로 보내 줄것이다. 
    const db = new Client(pgInit)
    // console.log(moment(new Date().getTime()))
    //console.log(req.hostname);
    const result ={
        "sucess":false
    }
    db.connect((err) => {
        if(err) {
            console.log(err)
        }
    })
    const sql="SELECT * FROM  memoschema.user WHERE userid=$1 and userpw=$2"
    const values=[idValue,pwValue]
    // console.log(values)

    db.query(sql,values,(err,data) =>{
        console.log("검사"+ err) 
        if(!err){
            const row=data.rows;
            // console.log(row)
            if(row.length == 0){
            }else {

                //세션 생성
                req.session.userid=idValue
                req.session.userpw=pwValue 
                req.session.userip=reqHost
                
                result.sucess=true
                const apiName="login"//????
                const apiCallTime=getCurrentDate()

                //function으로 호출 하기 
                // logFuntion(idValue,apiName,row,apiCallTime)

                //axios로 api 호출 하기 
                axios.post("http://localhost:8000/logAPi",{
                    userId:idValue,
                    name:apiName,
                    sendDate:row,
                    time:apiCallTime
                })
                .then(function(response){
                    console.log("axios",response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })

            }
        }
        else {
            console.log(err)
        }
        res.send(result)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.
        db.end()
    })
    //프론드에게 값을 반환
   //db.end() 위에 것랑 같이 돌아 가서 미리 끝나 버린다. 

})
//회원 가입

router.post("/signUp",(req,res)=>{
    const idValue=req.body.id
    const pwValue=req.body.pw
    const signDate=req.body.signupDate

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
        const apiName="signUp"//????
        const apiCallTime=moment(new Date().getTime())

        //function 으로 하기 
        //logFuntion(idValue,apiName,rows,apiCallTime)

        //axios api 로 호출 하기 
        axios.post("http://localhost:8000/logAPi",{
                    userId:idValue,
                    name:apiName,
                    sendDate:row,
                    time:apiCallTime
                })
                .then(function(response){
                    console.log("axios",response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })

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

// module.exports=router,{router}//무조건 router로 해달라 여러개 해달라 