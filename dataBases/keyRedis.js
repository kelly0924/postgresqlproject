const router=require("express").Router()
const path=require("path")//파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 한다.
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 pg 패캐지를 사용해야 postgrSQL을 사용 가능 하다.

const recvRedisKey=(idValue)=>{
    //db 연결 --> redis key 불러 오기 
    let redisKey=""
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
        }
        db.end()
    })

    return redisKey
}

module.exports=recvRedisKey