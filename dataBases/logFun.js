const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
//const mongo=require("./mongodb")//디를 만들어 준 스키마 

const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/";

// router.get("/db",(req,rsp)=>{

//     MongoClient.connect(url, function(err, db) {
//         if (err){
//             console.log(err)
//         }
//         const dbo = db.db("mydb");//디비 이름
//         const myobj = { 
//             usid: "",
//             whenCallApi: "",
//             sendData: "", 
//             apiCallTime: ""
//         }//삽입일  내용

//         dbo.collection("record").insertOne(myobj, function(err, res) {
//           if (err){
//             console.log(err)
//             }else{
//                 console.log("1 document inserted");
//             }
//           db.close();
//         });
//     })

// })

const logFun=(userid,apiName,data, time)=>{
    MongoClient.connect(url, function(err, db) {
            if (err){
                console.log(err)
            }
            const dbo = db.db("mydb");//디비 이름
            const myobj = { 
                usid: userid,
                apiname: apiName,
                senddata:data, 
                apicalltime: time
            }//삽입일  내용
    
            dbo.collection("record").insertOne(myobj, function(err, res) {
                if (err){
                console.log(err)
                }else{
                    console.log("1 document inserted");
                }
                db.close();
            });
    })
}

module.exports=logFun