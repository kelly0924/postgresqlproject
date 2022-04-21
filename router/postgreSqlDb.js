const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 

const pgInit = {
    user:"ubuntu",
    password:"1234",
    host:"localhost",
    database:"memodb",
    prot:5432
}

module.exports=pgInit
// mariaDb 같은 경우, class 타입으로 되어 있지 않기 때문에, 단순히 json만을 export하여 중복 코드를 제거하고 편하게 사용할 수 있지만,
// postgreSql의 pg의 경우, class타입으로 되어 있어 객체로 변경 후 사용하도록 지시한다.
// 하지만 js의 경우 다른 함수로 매개변수를 보낼 때, 무조건 주솟값으로 전달 되므로, 복제된 값이 전달되게 된다.

// 이 결과 현재 이 모듈 파일을 사용하는 모든 api에서 같은 postgreSql 연결 객체를 공유하게 된다. 그래서 오류가 난다. 

//오류를 해결 하기 위해서 pgInit 을 애초에 객체로 만들어 서 export 하는 것이 아닌 그냥 json 형태로 export 해주고 
// 그다음 api를 호출 할 때 마다 개체를 생성 해서 사용 하면 된다. 

// 오류 나는 코드 
// const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
// const pgInit = new Client {
//     user:"ubuntu",
//     password:"1234",
//     host:"localhost",
//     database:"memodb",
//     prot:5432
// }

// module.exports=pgInit


//-> 해결 코드   db 분활 자체는 
// 위와 같이 하고  

// api 를 만드는 파일에서 다음 과 같이 사용 하면 된다. 

// const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 

// const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 

// router.get("/memoMainPage",(req,res)=>{
//     const db = new Client(pgInit)//객체는 api  만들어 지는 안에서 사용 

//     db.connect((err) => {
//         if(err) {
//             console.log(err)
//         }
//     })
//     const sql="SELECT * FROM memoschema.memo"
   
//     db.query(sql,(err,data) =>{
//         console.log("검사"+ err) 
//         if(err){
//             console.log(err)
//         }
//         db.end()
//         res.send(data)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.

//     })
//     //프론드에게 값을 반환
//    //db.end() 위에 것랑 같이 돌아 가서 미리 끝나 버린다. 
// })

