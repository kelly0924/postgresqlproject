const router=require("express").Router()
const path=require("path")//파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 한다.
const redis=require("redis").createClient()
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다.

let redisKey = ""//키가 유일 해야 한다. 

//let scoreValue=0--> 전역 변수는 매우 위험: 가급적 쓰지 않는 것이 좋다

router.post("/",async(req,res)=>{//검색어 넣기 

    const searchWord=req.body.userInput
    const idValue=req.body.id
    const scoreValue=nowtimer()//시간은 계속 증가 하므로 이 값을 score 값으로 사용 하겠다. 

    const result = {
        "success": false,
    }
    //db 연결 --> redis key 불러 오기 
    const db=new Client(pgInit)
    db.connect((err) => {
        if(err) {
            console.log(err)
        }
    })
    const sql="SELECT rediskey FROM  memoschema.user WHERE userid=$1"
    const values=[idValue]

    db.query(sql,values,(err,data) =>{

        console.log("검사"+ err) 
        if(!err){
            const tempjson=data.rows[0].rediskey
            redisKey=String(tempjson)
            console.log(redisKey)
        }
        db.end()
    })
   
    //redis 
    console.log(searchWord, scoreValue)
    try{
       await redis.connect()//비동기 함수의 await 붙히고 
       await redis.zAdd(redisKey,[
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

router.get("/word", async(req,res)=>{

    const result={
        "success":false,
        "rdvalue":null
    }

    try{
        await redis.connect()//비동기 함수의 await 붙히고 
        const totalValue=await redis.ZRANGE(redisKey, 0, -1)
        result.rdvalue=totalValue
         console.log(totalValue)

        //    if(size.length > 5){//입력한 수가 5개가 넘을 경우 
        //         const sortFirstValue= await redis.ZRANGE(redisKey, 0,0)//맨 첫번의 value를 리턴 한다. 
        //         await redis.ZREM(redisKey,sortFirstValue)//점수가 가장 작은 맨 앞에 것을 삭제 하고 
        //     }
        await redis.disconnect()

        result.success=true
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }
    
})

router.delete("/",async(req,res)=>{
    const result = {
        "success": false,
    }

    try{
        await redis.connect()//비동기 함수의 await 붙히고 
        // await redis.expire(redisKey,1)//값을 조작하거나 추가 하거나 할때 expire시간을 해줘야 한다. 
        await redis.del(redisKey)
        await redis.disconnect()
 
        result.success=true
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
