
// const  db = mongoose.connection;
// db.on('error', function(){
//     console.log('Connection Failed!');
// });

// db.once('open', function() {
//     console.log('Connected!');
// });

// const logRecord = mongoose.Schema({// 스키마 즉 RDB 의 테이블
//     id: "string",
//     whenCallApi: "string",
//     sendData: "string",
//     apiCallTime: "string"

// })

// // const logData= mongoose.model('Schema', logRecord)

// // const newLogData=new logData({whenCallApi:"20220423",sendData:"hellow",apiCallTime:"12:00:23"}) //새로운 객체를 만들고 

// // newLogData.save(function(error, data){
// //     if(error){
// //         console.log(error);
// //     }else{
// //         console.log('Saved!')
// //     }
// // })

module.exports=logRecord// 밖에서 쓸수 있다. api 를 호출 하는 곳에서 사용 할 수 가 있다. 