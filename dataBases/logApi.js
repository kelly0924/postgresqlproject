
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