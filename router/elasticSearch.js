const router=require("express").Router()
const elastic=require("@elastic/elasticsearch")

router.post("/",async(req, res)=>{//date 넣기

    const userInput=req.body.usInput
    const result={
        "success":false
    }
    const esConnect=new elastic.Client({
        node:"http://localhost:9200/" // 별다른 설정이 없이 이렇게 적으면 싱클 로드에 해준다. 
    })

    try{

        //await esConnect.ping({requestTimeout:1000})
        await esConnect.index({
            index:"es_search_test",
            body:{
                search_name:userInput
            }
        })

        result.success = true
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }
    
})

router.get("/",async(req,res)=>{

    const usInput =req.query.value//get은 query로 한다.
    
    const result={
        "success":false,
        "searchValue":null
    }

    const esConnect= new elastic.Client({
        node:"http://localhost:9200/"//하나의 노드를 사용하겠다.
    })

    try{

        //await esConnect.ping({requestTimeout: 1000})  
        const recvValue= await esConnect.search({
            index:"es_search_test",//index가 es_search_test인 것에
            body:{
                query:{

                    // match:{//같은 것 type은 search_name이고 doucment가 userinput인 것을 찾아라 
                    //     search_name:usInput
                    // }

                    // match:{
                    //     search_name:{//match는 기본적으로 or이여서 입력 검색어 포함된 모든 doucment 검색 
                    //         query:usInput,
                    //         operator: "and" //그러나 operator: and 이면 입력한 검색어에 and를 결과를 보여 준다. 
                    //     }
                    // }
                    

                    // match_all:{ }  한경우 모든 입력된 search_name이라는 type에 doucment를 모두 가져 가져 오는 것 
                    //elasticsearch 는 query에 아무런 조건을 주지 않으면 match_all{}과 같이 모든 것을 검색


                    // match_phrase:{//정확히 입력한 검색어가 정확히 포함 되여 있는 것만 검색 된다. 
                    //     search_name:usInput
                    // }

                    //match_phrase에는 slop 옵션이 있다. slop: 1등으로 사용 
                    // 내가 입력한 검색어와 완전 동일 한 단어 사이 1개 단어까지 허용 한다는 소리이다. 

                    // match_phrase:{//정확히 입력한 검색어가 정확히 포함 되여 있는 것만 검색 된다. 
                    //     search_name:{
                    //         query:usInput,
                    //         slop:1
                    //     }
                    // }

                    // boolean query
                        //must, must_not , should, filer

                    // bool:{
                    //     must:[//반드시 참인 것만 검색 한다. 검색어 참이고 name 있는 그런 document를 검색 한다. 
                    //         {
                    //             match:{
                    //                 search_name:usInput
                    //             }
                    //         },{
                    //             match_phrase:{
                    //                 search_name:"name"
                    //             }
                    //         }
                    //     ]
                    // }


                    //should 는 검색어에 scor를 조정 할 때 많이 사용한다. should롤 score의 값을 더 크게 주고 싶은 docment에게 더 크게 주기 가능
                    

                }
            }
        })
        
        result.success=true
        result.searchValue=recvValue
        res.send(result)

    }catch(err){
        console.log(err)
        res.send(result)
    }

})




module.exports=router