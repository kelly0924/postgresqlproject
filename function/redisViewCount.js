const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const redis=require("redis").createClient()//redis를 사용하기 위한 import


const redisKey="loginCount"
const viewCount=async(idValue)=>{//redis 추가 해주는 역활을 해주는 함수 
    try{
        //redis 연결 
        await redis.connect()

        //로그인 한 수 -> 한명이 하루에 여러번 가능 중복 가능
        const loginCounter= await redis.get(redisKey)

        if(loginCounter == null){//만약 처음 로그인을 했다면 
            await redis.set(redisKey,1)// 새로운 redis를 만들어 준다. 값은 1로 
        }else{
            await redis.set(redisKey,parseInt(loginCounter)+1)// 사용자가 1번이상의 로그인 일경우 이전에 값에 +1을 증가 한다. 
        }
        await redis.disconnect()//연결된 redis 연결 끊기 

    }catch(err){
        console.log("reids:",err)
    }

    
}

module.exports=viewCount