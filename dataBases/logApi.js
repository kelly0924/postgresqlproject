const router=require("express").Router()
const path=require("path")


router.post("/",(req,res)=>{
    //console.log("logApi: ",req.body.userId,req.body.name,req.body.time)
    
    const result={
        "success":false
    }
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
        if (err){
            console.log(err)
        }
        const dbo = db.db("mydb");//디비 이름
        const myobj = { 
            usid: req.body.userId,
            callApiName: req.body.name,
            data: req.body.sendDate,
            apiCallTime: req.body.time
        }//삽입일  내용
        dbo.collection("record").insertOne(myobj, function(err, response) {
          if (err){
            console.log(err)
            }else{
                result.success=true//db에 성공적으로 잘 넣으면 true 넣어 주기 
                console.log("log inserted");
                res.send(result)
            }
            db.close()
        })
    })
    //res.send(result)

})

module.exports=router