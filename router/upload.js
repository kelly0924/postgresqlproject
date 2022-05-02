const multer =require('multer');
const multerS3 = require('multer-s3')
const AWS = require("aws-sdk");
require('dotenv').config();
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,  // 액세스 키 입력
    secretAccessKey: process.env.SECRET_ACCESS_KEY, // 비밀 액세스 키 입력
    region: 'ap-northeast-2', // 사용자 사용 지역 (서울의 경우 ap-northeast-2)
})

const upload = multer({ 
    storage: multerS3({ 
        s3: s3, 
        bucket: 'kelly0924', // 버킷 이름 입력 
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => { 
            cb(null, `${Date.now()}_${file.originalname}`)
        }
    })
});

module.exports = upload;