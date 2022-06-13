const router=require("express").Router()
const path=require("path")//파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 한다.
const redis=require("redis").createClient()
const redisKey="searcText"

let scoreValue=0

router.post("/",async(req,res)=>{//검색어 넣기 

    const searchWord=req.body.userInput
    //const scoreValue=nowtimer()// 점수를 현재 시간 api 를 호출한 식간으로 할것이다. 
    scoreValue=scoreValue+1//api 호출 될 때 마다 증가 

    const result = {
        "success": false
    }

    console.log(searchWord, scoreValue)
    try{
       await redis.connect()//비동기 함수의 await 붙히고 
       await redis.zAdd(redisKey,[
        {
          score: scoreValue,
          value: searchWord
        }])
       await redis.expire(redisKey,12*60*60)//값을 조작하거나 추가 하거나 할때 expire시간을 해줘야 한다. 
       await redis.disconnect()

       result.success=true
       res.send(result)
    }catch(err){
        console.log(err)
        res.send(result)
    }
   
})

router.get("/word", async(req,res)=>{

    const result={
        "success":false,
        "value":0
    }
    try{
        await redis.connect()//비동기 함수의 await 붙히고 
        
        const value= await redis.ZRANGE('searcText', 0, -1)
        let index=value.length
        index=index - 5
        //\\const tmp=await redis.zRevrange('searcText',0,-1)
        const tmp= await redis.ZRANGE('searcText', index, -1)
        console.log(value.length)
        await redis.disconnect()

        result.success=true
        result.value=tmp
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
