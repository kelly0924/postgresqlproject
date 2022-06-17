const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const redis=require("redis").createClient()//redis를 사용하기 위한 import

const viewUser=async(idValue)=>{//redis 추가 해주는 역활을 해주는 함수 
 
    try{
        //redis 연결 
        await redis.connect()
        //login 한 사용자 수를 저장 하기 위한 redis --> 중복 횟수 중가 안됨
        await redis.sAdd("userCount",idValue)//중복 불가 
        await redis.disconnect()//연결된 redis 연결 끊기 

    }catch(err){
        console.log("reids:",err)
    }

    
}

module.exports=viewUser