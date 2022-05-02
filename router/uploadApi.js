const router=require("express").Router()
const path=require("path")// 파일 경로를 조합 해주는 패케지 이다.  이것이 있어야 
const upload = require("./upload");

router.post('/', upload.single('img'), (req, res, next) => {
    res.send(req.file);
})


module.exports=router