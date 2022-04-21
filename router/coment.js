const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 

router.get("/comentView",(req,res)=>{
    console.log("호출")
    let mid=req.query.index
    console.log(mid)
    //mid를 와 memocontents를 가져 온다. 그 컨텐즈에 대긋도 가져와서 
    //새로운 파일에 보내줘야 한다. 
})

module.exports=router//