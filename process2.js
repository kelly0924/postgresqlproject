
const redis=require("redis").createClient()
const schedule = require('node-schedule')

const pgInit=require("./router/postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다. 
//pg 우리가 사용 psql callback 만 된다. 
const redisKey="loginCount"

console.log("process 2 실행")

// const job = schedule.scheduleJob('50 * * * * *', async()=>{//0 0 * * * 자정일 경우 
const job =schedule.scheduleJob('0 0 * * *', async () => {//자정 마다 db update
    console.log('middlenigt doing event')
    try {
        await redis.connect()
        const userCounter = await redis.get(redisKey)
        if(userCounter == null){//null 이라는 소리는 로그인을 한번도 하지 않은 상태
            console.log("로그인을 하지 않음!")
        }else{
            console.log("디비 연결 시도")
            const db = new Client(pgInit)
            console.log("디비 연결 시도")

            db.connect((err)=>{
                if(err){
                    throw(err)
                }
            })
            console.log("디비 연결 시도")

            const sql="UPDATE memoschema.count SET counter=$1"
            db.query(sql, [userCounter],(err,rows) =>{
                if(!err){
                    console.log("db update success!")
                }else{
                    throw(err)
                }
             
                db.end()   //비동기 신경 쓰기 
            })  
        }
        await redis.disconnect()
    }
    catch (err) {
        console.log("err발생")
        console.log(err)
    }
})

//job() test 하기 


