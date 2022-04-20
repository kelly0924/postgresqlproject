const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 

const pgInit=new Client({
    user:"ubuntu",
    password:"1234",
    host:"localhost",
    database:"memodb",
    prot:5432
})

module.exports=pgInit