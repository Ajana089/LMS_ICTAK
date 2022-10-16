const student = require("../models/createStudent");
const express = require("express");
const router = express.Router();
const uniqueID = require("../utils/uniqueID");
const bcrypt=require("bcrypt");
const path = require("path");

const multer=require("multer");//for file uploading
router.use(express.static('uploads'));
//const Google_drive_id='1SIUewKVIpdsryG7X9JwL0ZlI7DZbLsqQ'


const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_API_FOLDER_ID = '1SIUewKVIpdsryG7X9JwL0ZlI7DZbLsqQ'




router.get("/get-student-details", async function (req, res) {
    try {
        const contract = student
            .findOne({email: req.email})
            .then((data) => {
                if (data) {
                    res.status(200);
                    res.json(data);
                } else {
                    res.status(404);
                    res.json({
                        message: ["student not found"],
                    });
                }
            })
            .catch((err) => {
                console.log("Error:", err);
                res.json(err);
            });
    }
    catch (err)
    {
        console.log("error", err)
        res.status(500)
        res.json(err);
    }
});




//fileuploading 

//let upload=multer({dest:'uploads/'});

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        cb(null,Date.now() + ext)
    }
})


var upload=multer({storage:storage})

router.post('/file',upload.single('file'),(req,res,next)=>{
  try{

    const file=req.file;
    console.log(file);
    if(!file){
        const error=new Error("Please Upload a file");
        error.httpStatusCode=400;
        return next(error)
    }
    res.send(file);
//file uploading googledrive
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: './googlekey.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': '',
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: '',
            body: fs.createReadStream(file.path)
        }

        const response = driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id
        console.log("id"+id);

    }catch(err){
        console.log('Upload file error', err)
    }

 }
  catch(error){
    console.log("Error occured"+error);
  }


})

// uploadFile().then(data=>{
//     console.log("id"+data);
// })



router.post('/add-student',async (req,res)=>{

    try{
    res.header("Access-Control-Allow-Orgin","*");
    res.header('Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE')
    let uID = uniqueID();

      //encryption password using bcrypt
       bcrypt.hash(req.body.user.password,10,(err,hash)=>{
        if(err){
            return res.json({success:false,message:'Give password'})
        }

        else
        {
            var user={

            id: uID,
            name: req.body.user.name,
            email: req.body.user.email,
            password:hash,
            number: req.body.user.number,
            qualification: req.body.user.qualification,
            specialisation: req.body.user.specialisation,
            isEnrolled: req.body.user.isEnrolled,
            gender:req.body.user.gender,
            user:req.body.user.user,
           }
           
          
        
           
            const usersign = new student(user);
            usersign.save((err,d)=>{
                if(err){
                    res.status(401).json({
                        message: 'Failed to create new user'
                    })
                } else{
                    res.status(200).json({
                        message: 'User created'
                    })
                }
            })
          
 
 
        } })

    }
    catch(err){
        console.log("error", err)
        res.status(500)
        res.json(err);
    }




})





router.get('/validate',async(req,res)=>{
    res.header("Access-Control-Allow-Orgin","*");
    res.header('Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE')
    console.log("email"+ req.body.email);
    student.find({email:req.body.email})
    .exec()
    .then((result)=>{
           if(result.length<1){
          //return  res.status(200).res.json({success:true,message:'Email  Successfully registered'})
           }
           else {
         //return  res.status(404).res.json({success:false,message:'Email  already exists'})
           }
        })
    })




router.get("/validate-student-details", async function (req, res) {
    try {
        const contract = student
            .findOne({email: req.email})
            .then((data) => {
                if (data) {
                    res.status(200);
                    res.json(data);
                } else {
                    res.status(404);
                    res.json({
                        message: ["user not found"],
                    });
                }
            })
            .catch((err) => {
                console.log("Error:", err);
                res.json(err);
            });
    }
    catch (err)
    {
        console.log("error", err)
        res.status(500)
        res.json(err);
    }
});

module.exports = router;