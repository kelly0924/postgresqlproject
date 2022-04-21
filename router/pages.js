
const router=require("express").Router()
const path=require("path")//파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 한다.

router.get("/",(req,res)=>{  //port 8000에 접속 했을 "/" 라는 뜻
    //우리가 api 한개를 등록 한것이다. get 방법 ("api 이름")
   // res.sendFile(__dirname +"../index.html")//이렇게만 쓰면 파일을 찾을 수가 없다. router에는 없었기 때문
    res.sendFile(path.join(__dirname,"../index.html"))//이 와 같이 해줘야 한다. 그래야 제대로 나온다. 
})


router.get("/loginPage",(req,res)=>{
   // res.sendFile(__dirname+ "/loginPage.html")
    res.sendFile(path.join(__dirname,"../loginPage.html"))
})

//회원 가입 
router.get("/memberJoin",(req,res)=>{
    res.sendFile(path.join(__dirname,"../memberJoin.html"))
})

//메모 페이지 
router.get("/memoPage",(req,res)=>{
    res.sendFile(path.join(__dirname,"../memoPage.html"))
})
//메모 추가 하기 
router.get("/addMemo",(req,res)=>{
    res.sendFile(path.join(__dirname,"../addMemoPage.html"))
})

module.exports=router