const express = require('express');
var app = express();
var upload = require('express-fileupload');
var docxConverter = require('express-fileupload');
var path = require('path');
var fs = require('fs');

//variables
const extend_pdf = '.pdf'
const extend_docx = '/docx'
var down_name

//use expres-filepload
app.use(upload());

//this will route the root page with index.html
app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
})

//post the upload file 
app.post('/upload', function(req,res){
    console.log(req.files);
    if(req.files.upfiles){
        var file = req.files.upfiles,
        name = file.name,
        type = file.mimetype;
        //file where .docx will be downloaded
        var uploadpath = __dirname + '/uploads/' + name;
        //name of the file
        const First_name = name.split('.')[0];
        //name to download the file 
        down_name = First_name;
        //.mv function will be used to move the uploaded file to the upload folder temporarly
        file.mv(uploadpath,function(err){
            if(err){
                console.log(err);
            }else{
                //path of the downloaded or uploaded file
                var initialPath = path.join(__dirname, `./uploads/${First_name}${extend_docx}`);
                //path where the converted pdf will be uploaded
                var upload_path = path.join(__dirname`/uploads/${First_name}${extend_pdf}`);
                //converter to convert docx-pdf
                docxConverter(initialPath,upload_path,function(err,result){
                    if(err){
                        console.log(err);
                    }
                    console.log('result'+result);
                    res.sendfile(__dirname+'/down_html.html')
                });
            }
        });
    }else{
        res.send("No File Selected!");
        res.end();
    }
});

//link all files and adding delete function

app.get('/download',(req,res) =>{
    //this will be used to download the coverted file
    res.download(__dirname+`/upload/${down_name}${extend_pdf}`,`${down_name}${extend_pdf}`,(err) =>{
        if(err){
            res.send(err);
        }else{
            //delete files from uploads directory after use 
            console.log('Files deleted');
            const delete_path_doc = process.cwd() + `/uploads/${down_name}${extend_docx}`;
            const delete_path_pdf = process.cwd() + `/uploads/${down_name}${extend_pdf}`;  
            try {
                fs.unlinkSync(delete_path_doc)
                fs.unlinkSync(delete_path_pdf)
                //file removed
            } catch(err) {
                console.log(err)
            }
        }
    })
})
//link the thank page
app.get('thank',(req,res) => {
    res.sendFile(__dirname+'/thank.html')
})
//start the server at port 3000
app.listen(3000,() => {
    console.log("Server started at port 3000")
})