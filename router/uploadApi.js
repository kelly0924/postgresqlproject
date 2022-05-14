const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const upload = require("./upload")
const AWS = require("aws-sdk");
const {Client}=require("pg")//pg 는 Client 로 이름 고정 여러개 하기 위해 
const pgInit=require("./postgreSqlDb")//데이터 베이스를 사용하기 위해서 

router.post('/', upload.single('img'), (req, res) => {//이미지를 s3에 저장 하는 api 
   // console.log("api에서  url" ,req.file.location)
    const urlImg=req.file.location
    const usid="coco"
    const memoid=1
    const imguploadDate="20220512"
    const result={
        "succeed":false
    }
    const db = new Client(pgInit)

    db.connect((err) => {
        if(err) {
            console.log(err)
        }
        else{
            console.log("connect db")
        }
    })

    const sql="INSERT INTO memoschema.memoimg(userid,memoid,imgurl,imguploadDate) VALUES($1,$2,$3,$4)"//img url을 과 유저이름 
    const valuses=[usid,memoid,urlImg,imguploadDate]
    db.query(sql,valuses,(err,row) =>{
        if(!err){
            result.succeed=true//이미지가 성공적으로 잘 저장 여부 알려 주기 
        }else{
            console.log(err)
        }

       res.send(result)
       db.end()
    })

    // const fileName=req.body.img// 사용자가 보낸 파일 이름 받아 오기 
    // const filekey=fileUploadDate() + fileName
    // const url = "https://kelly0924.s3.ap-northeast-2.amazonaws.com/" + fileke

    // res.send(req.file);//이  api 를 호출 해서 안에있는 파일 경로, 파일 이름 다 가져 접 근 가능
    
})

const fileUploadDate=()=>{
    const dt=new Date()
    const nowTime=dt.getFullYear()+(dt.getMonth()+1)+dt.getDate()+dt.getHours+dt.getMinutes+dt.getSeconds
    return nowTime

}


//메모 추가 api 에서 현재 api 를 호출 해서 사용 할 수 잇다. 
    // {
    //     "fieldname": "img",
    //     "originalname": "id.png",
    //     "encoding": "7bit",
    //     "mimetype": "image/png",
    //     "size": 819,
    //     "bucket": "kelly0924",
    //     "key": "1652017507410_id.png",
    //     "acl": "private",
    //     "contentType": "image/png",
    //     "contentDisposition": null,
    //     "contentEncoding": null,
    //     "storageClass": "STANDARD",
    //     "serverSideEncryption": null,
    //     "metadata": null,
    //     "location": "https://kelly0924.s3.ap-northeast-2.amazonaws.com/1652017507410_id.png",
    //     "etag": "\"042538b302c1a5b1dbed23607303e626\""
    // }
    //id -- > 업  -> 시간 + 사용자 입력한 파일 이름 (url) -> s3 (키 시간+이름)\


module.exports=router