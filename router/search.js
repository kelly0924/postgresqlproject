const router=require("express").Router()
const path=require("path")//파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 한다.
const redis=require("redis").createClient()
const redisKey="searcText"

router.post("/",async(req,res)=>{//검색어 넣기 

    const searchWord=req.body.userInput
    const scoreValue=nowtimer()// 점수를 현재 시간 api 를 호출한 식간으로 할것이다. 

    const result = {
        "success": false,
    }

    console.log(searchWord, scoreValue)
    try{
       await redis.connect()//비동기 함수의 await 붙히고 
       await redis.zAdd("searcText",[
        {
          score: scoreValue,
          value: searchWord
        }])

       await redis.disconnect()
       result.success=true

       res.send(result)
    }catch(err){
        console.log(err)
        res.send(result)
    }
   
})

router.get("/", async(req,res)=>{

    const result={
        "success":false,
        "value":0
    }
    try{
        await redis.connect()//비동기 함수의 await 붙히고 
        
        const value= await redis.ZRANGE('searcText', 0, 4,'REV')
        for await (const {value,score} of redis.zScanIterator('searcText')) {
            console.log(score);
            console.log(value)
        }
        await redis.disconnect()

        result.success=true
        result.value=value
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }
    
})

const nowtimer=()=>{
    let today = new Date()
    let year = today.getFullYear() // 년도
    let month = today.getMonth() + 1  // 월
    let date = today.getDate()  // 날짜
    let hour=today.getHours()
    let min=today.getMinutes()//분
    let sec=today.getSeconds()
    let now=`${year}` + `${month}` + `${date}` + `${hour}` + `${min}`  + `${sec}`

    return parseInt(now)
    
}

module.exports=router
