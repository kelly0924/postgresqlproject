const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야

const cookieValue=()=>{
    const tokenCookie=document.cookie  
    const tokenArr=tokenCookie.split("=")
    const tokenValue=tokenArr[1]
    return tokenValue
}

console.log(cookieValue())

module.exports=cookieValue