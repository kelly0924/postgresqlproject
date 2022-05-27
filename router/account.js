const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다. 
const logFuntion=require("./logFun")
const moment = require("moment")
const axios=require("axios")
const cookie = require("cookie")//쿠키 사용
const jwt=require("jsonwebtoken")//jwt token 사용

const secretKey="qwwdfdlfdjfkafhaeseongjhioerhhwadnelasdjefdofdnjflgdjf"

router.post("/",(req,res)=>{
    //사용자로 부터 입력 받은 값

    const idValue= req.body.id
    const pwValue= req.body.pw

    //프론트 엔드로 보내 줄값 json으로 받았으니까 json으로 보내 줄것이다. 
    const result ={//프론트 엔드에게 보내 줄 값, 로그인 성공 여부, 발급된 토큰, 토큰 발급 도중 에로가 나면 에로 메세지
        "sucess":false,
        "token":"",
        "message": null
    }

    //db 연결
    const db = new Client(pgInit)
    db.connect((err) => {
        if(err) {
            console.log(err)
        }
    })
    const sql="SELECT * FROM  memoschema.user WHERE userid=$1 and userpw=$2"
    const values=[idValue,pwValue]
    db.query(sql,values,(err,data) =>{
        console.log("검사"+ err) 
        if(!err){
            const row=data.rows;
            // console.log(row)
            if(row.length == 0){
            }else {
                //토큰 생성
                console.log("들어 오나")
                const jwtToken=jwt.sign(
                    {
                        "id":idValue,
                        "pw":pwValue
                    },
                    secretKey,
                    {
                        "issuer": "coco",// 발급자 메모용
                        "expiresIn":"1m" //토큰 완료 시간
                    }
                )
            
                result.token=jwtToken
                result.sucess=true
                // console.log(result.sucess, "로그인")
                // console.log("token",result.token)
                
                //    // res.cookie('token', jwtToken); // 클라이언트에 쿠키로 전달
                // res.cookie('cookie', jwtToken, {//쿠키를 만든다는 것 자체는 로그인이 성공 한 다음 이다. 
                //     httpOnly: true,
                
                // })

            // 로고 남기기 
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


//서버에서 토큰의 유효성을 검증 해주는 API 이다. 

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