
const redis=require("redis").createClient()
const schedule = require('node-schedule')

const pgInit=require("./router/postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다. 

const redisKey="loginCount"

console.log("process 2 실행")

const job = schedule.scheduleJob('50 * * * * *', async()=>{//0 0 * * * 자정일 경우 
    console.log('middlenigt doing event')

    //redis를 연결 
    // await redis.connect()
    // const userCounter= await redis.get(redisKey)
    // if(userCounter == null){//null 이라는 소리는 로그인을 한번도 하지 않은 상태
    //     console.log("로그인을 하지 않음!")
    // }else{
    //     //디비에 저장 하기 
    //     const db = new Client(pgInit)
    //     await db.connect()//디비 연결
    //     const sql="UPDATE memoschema.count SET counter=$1"
    //     const data = await db.query(sql,userCounter)
    //     const row=data.rows;
    //     if(row.length != 0){
    //         console.log("db update success!")
    //     }
    // }
    // await redis.disconnect()//연결된 redis 연결 끊기 
    // await db.end()     


    await redis.connect()
    const userCounter= await redis.get(redisKey)
    if(userCounter == null){//null 이라는 소리는 로그인을 한번도 하지 않은 상태
        console.log("로그인을 하지 않음!")
    }else{
        const db = new Client(pgInit)
        db.connect((err)=>{
            if(err){
                console.log(err)
            }
        })
        const sql="UPDATE memoschema.count SET counter=$1"
        db.query(sql,userCounter,(err,rows) =>{
            if(!err){
                console.log("db update success!")
            
            }else{
                console.log(err)
            }
        }) 
        db.end()   
    }
    await redis.disconnect()
})

