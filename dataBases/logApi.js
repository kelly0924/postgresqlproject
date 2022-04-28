const router=require("express").Router()
const path=require("path")

router.post("/",(req,rsp)=>{
    console.log("logApi: ",req.body.userId,req.body.name,eq.body.time)
    // MongoClient.connect(url, function(err, db) {
    //     if (err){
    //         console.log(err)
    //     }
    //     const dbo = db.db("mydb");//디비 이름
    //     const myobj = { 
    //         usid: req.body.userId,
    //         callApiName: req.body.name,
    //         data: req.body.sendData,
    //         apiCallTime: req.body.time
    //     }//삽입일  내용
    //     dbo.collection("record").insertOne(myobj, function(err, res) {
    //       if (err){
    //         console.log(err)
    //         }else{
    //             console.log("1 document inserted");
    //         }
    //       db.close();
    //     });
    // })

})

module.exports=router