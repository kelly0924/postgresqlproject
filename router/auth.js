const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const jwt=require("jsonwebtoken")

const secretKey="qwwdfdlfdjfkafhaeseongjhioerhhwadnelasdjefdofdnjflgdjf"//토큰 인증을 위한 key
router.post("/",(req,res)=>{
    //const token=req.headers.auth//프론트엔드에서 보내준 token
    const tokenValue=req.body.token
    console.log("token을 인증하기 위한 것" ,tokenValue)
    const result={
        "success":false,
        "message":null
    }
    try{
        jwt.verify(tokenValue,secretKey)//서버가 가지고 있는 secretKey로 검증한다.
        result.success=true
        res.send(result)
    }catch(e){
        result.message="토큰이 잘못 됬음"
        res.send(result)
    }
})


module.exports=router