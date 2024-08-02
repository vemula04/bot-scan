const express = require('express');
const router = express.Router();
const upload = require("express-fileupload");
const AWS = require("aws-sdk");

// s3 config
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // your AWS access id
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // your AWS access key
  });
  
  // actual function for uploading file
  async function uploadFile(file) {
    try {
        console.log("111111111 uploadFile ||||||||||||")
        const params = {
            Bucket: process.env.AWS_S3_BUCKET, // bucket you want to upload to
            Key: `public/hotelscan-${Date.now()}-${file.name}`, // put all image to fileupload folder with name scanskill-${Date.now()}${file.name}`
            Body: file.data,
            ContentType: 'image/jpeg',//will change it to dynamic content type logic
            ACL: "public-read",
          };
          const data = await s3.upload(params).promise();
          return data.Location; // returns the url location
    } catch (err) {
        console.error(err);
        console.log(`Error :: upload File ::`)
    }
    
  }
  
router.post("/upload", async (req, res) => {
    try {
        console.log("Upload :: initialized ::")
        const fileLocation = await uploadFile(req.files.file);
        // returning fileupload location
        return res.status(200).json({ location: fileLocation });
    } catch (err) {
        res.status(400).send({
            statusCode: 502,
            data: err
        })
    }
});

module.exports = router;