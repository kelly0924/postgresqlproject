const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 

//메모 보여주는 api 
router.get("/memoMainPage",(req,res)=>{
    const db = new Client(pgInit)

    db.connect((err) => {
        if(err) {
            console.log(err)
        }
    })
    const sql="SELECT * FROM memoschema.memo"
   
    db.query(sql,(err,data) =>{
        console.log("검사"+ err) 
        if(err){
            console.log(err)
        }
        db.end()
        res.send(data)// 값만 보내 줄것이다. 값을 보내  때는 send로 보내 준다.

    })
    //프론드에게 값을 반환
   //db.end() 위에 것랑 같이 돌아 가서 미리 끝나 버린다. 
})

//메모 추가 하기 

router.post("/addMemoPage",(req,res)=>{
    // router.post("/",(req,res)=>{
    const titleValue=req.body.title
    const contentsValue=req.body.contents
    const dateValue=req.body.writeDate
    const userValue=req.body.user

    const db = new Client(pgInit)
    const result={
        "succeed":false
    }

    db.connect((err)=>{
        if(err){
            console.log(err)
        }
    })
    const sql="INSERT INTO memoschema.memo (userid,memotitle,memocontents,memodate) VALUES($1,$2,$3,$4)"
    const valuses=[userValue,titleValue,contentsValue,dateValue]
    db.query(sql,valuses,(err,rows) =>{
        if(!err){
            result.succeed=true
            console.log(rows)
        }else{
            console.log(err)
        }

       res.send(result)
       db.end()
    })
})


module.exports=router//