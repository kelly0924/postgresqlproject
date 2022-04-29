const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 

router.post("/all",(req,res)=>{
    console.log("호출")
    const mid=req.body.num
    console.log(mid)
    const result={
        "contents": " ",
        "coment": " "
    }
   // console.log(mid) 
    const db = new Client(pgInit)//데이터 베이스 사용을 위해 객체 하나를 생성 해준다. 
    db.connect((err) => {
        if(err) {
            console.log(err)
        }
    })
    const sql="SELECT memocontents FROM memoschema.memo WHERE memoid = $1"   
    const sqlcoment="SELECT * FROM memoschema.coment"

    const values=[mid]
    db.query(sql,values,(err,data) =>{
        console.log("검사"+ err) 
        if(err){
            console.log(err)
        }
        result.contents=data
    })

    db.query(sqlcoment,(err,cdata) =>{
        console.log("검사"+ err) 
        if(err){
            console.log(err)
        }
        result.coment=cdata
        db.end()
        res.send(result)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.
    })

   
})

module.exports=router//