const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const elastic=require("@elastic/elasticsearch")

const elasticInsert=async(title,contents,data,userId)=>{

    const esConnect=new elastic.Client({
        node:"http://localhost:9200/" // 별다른 설정이 없이 이렇게 적으면 싱클 로드에 해준다. 
    })

    try{
        await esConnect.index({
            index:"memo_member",
            body:{
                memoTitle:title,
                memoContents:contents,
                memoInputDate:data,
                memoUsId:userId
            }
        })

    }catch(err){
        console.log("elasticFuntion err: "+err)
    }


}


module.exports=elasticInsert