const router=require("express").Router()
const elastic=require("@elastic/elasticsearch")
const esInsertFun=require("../function/elasticInsertFun")


router.post("/",(req,res)=>{
    
    const result={
        "success":false
    }

    const titleValue=req.body.title
    const contentsValue=req.body.contents
    const dateValue=req.body.writeDate
    const userValue=req.body.user

    //이 함수를 addMemo api 안에서 호출 할 것이다. 
    esInsertFun(titleValue,contentsValue,dateValue,userValue)
    result.success=true
    res.send(result)
})

//사용자 명  사용자가 쓴 게시글 찾기

router.get("/us",async(req,res)=>{

    const userValue=req.query.userId
    const result={
        "success":false,
        "data":null
    }

    const esConnect=new elastic.Client({
        node:"http://localhost:9200/" 
    })

    try{
        const recvValue=await esConnect.search({
            index:"memo_member",
            _source: ["memoContents"],//리턴 하는 filed 
            size:2,//리턴하는 hits의 갯수 hits는 검색 결과를 저장 되어 있는 곳
            body:{
                query:{
                    match:{
                        memoUsId:userValue
                    }
                }
            }
        })

        result.success=true
        result.data=recvValue
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }

})

//제목 기준 으로 검색 단어만 들어 가도 그 단어가 포함된 제목이 있는 제목과 내용 보여 주기

router.get("/title",async(req,res)=>{

    const userValue=req.query.title
    const result={
        "success":false,
        "data":null
    }

    const esConnect=new elastic.Client({
        node:"http://localhost:9200/" 
    })

    try{
        const recvValue=await esConnect.search({
            index:"memo_member",
            _source: ["memoContents","memoTitle","memoUsId"],//리턴 하는 filed 
            size:2,//리턴하는 hits의 갯수 hits는 검색 결과를 저장 되어 있는 곳
            body:{
                query:{
                   match_phrase:{//정확히 입력한 검색어가 정확히 포함 되여 있는 것만 검색 된다. 
                        memoTitle : userValue
                    }
                }
            }
        })

        result.success=true
        result.data=recvValue
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }

})


//날짜 기준 으로 검색 하는 api 사용자가 입력한 날짜 이후에 data를 보내 주기 
router.get("/memodata",async(req,res)=>{

    const userValue=req.query.value

    const result={
        "success":false,
        "dataValue":null
    }

    const esConnect=new elastic.Client({
        node:"http://localhost:9200/" 
    })

    try{
        const recvValue=await esConnect.search({
            index:"memo_member",
            _source: ["memoContents","memoInputDate"],//리턴 하는 filed 
            size:5,//리턴하는 hits의 갯수 hits는 검색 결과를 저장 되어 있는 곳
            body:{
                query:{
                    range:{
                        memoInputDate:{
                            gt:userValue
                        }
                    }
                }
            }
        })

        result.success=true
        result.dataValue=recvValue
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }

})


//elasticsearch 에서 삭제 하기 
router.delete("/", async(req,res)=>{
    const value=req.body.value//get은 query로 한다.

    const result={
        "success":false
    }
    //elasticsearch init 부분 이부분에서 node 어떻게 사용 할지 설정 할 수 있음 
    const esConnect=new elastic.Client({
        node:"http://localhost:9200/" // 별다른 설정이 없이 이렇게 적으면 싱클 로드에 해준다. 
    })

    try {

        await esConnect.deleteByQuery({
            index: "memo_member",
            body: {
                query: {
                    match: {
                        memoUsId:value
                    }
                }
            }
        })
        result.success = true
        res.send(result)

    } catch(err) {
        console.log(err)
        res.send(result)
    }
    
})


module.exports=router