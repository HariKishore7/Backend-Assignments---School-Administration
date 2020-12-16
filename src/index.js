const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const fs=require('fs');
var studentArray=require('./InitialData');
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here
app.get('/api/student',(req,res)=>{
    res.send(studentArray);
});
app.get('/api/student/:id',(req,res)=>{
    let id=Number(req.params.id);
    if(id>=1 && id<=7){
        res.send({
            id:studentArray[id-1].id,
            name:studentArray[id-1].name,
            currentClass:studentArray[id-1].currentClass,
            division:studentArray[id-1].division
        });
    }
    else{
        res.sendStatus(404);
    }
    
});

app.post('/api/student',(req,res)=>{
    const bodyData=req.body;
    bodyData.id=new Date().valueOf();
    const name=req.body.name;
    const currentClass=req.body.currentClass;
    const division=req.body.division;
    if(name && currentClass &&division){
        fs.writeFile(`src/newAdmission/${bodyData.id}.json`,JSON.stringify(bodyData),'utf-8',(err)=>{
            if(err){
                res.sendStatus(400);
            }
            else{
                res.set({
                    'content-type':'application/x-www-form-urlencoded'
                });
                res.send(bodyData);
            }
        })
    }
    else{
        res.sendStatus(400)
    } 
});

app.put('/api/student/:id',(req,res)=>{
    const id=req.params.id;
    fs.readFile(`src/newAdmission/${id}.json`,'utf-8',(err,fileData)=>{
        if(err){
            res.sendStatus(400);
        }
        else{
            const existingData=JSON.parse(fileData);
            existingData.name=req.body.name;
            fs.writeFile(`src/newAdmission/${id}.json`,JSON.stringify(existingData),'utf-8',(err)=>{
                if(err){
                    res.sendStatus(400);
                }
                else{
                    res.set({
                        'content-type':'application/x-www-form-urlencoded'
                    });
                    res.send(existingData);
                }
            });
        }
    })
        
    
});

app.delete('/api/student/:id',(req,res)=>{
    const id=req.params.id;
    
    fs.unlink(`src/newAdmission/${id}.json`,(err)=>{
        if(err){
            res.sendStatus(404);
        }
        else{
            res.sendStatus(200);
        }
    })
});


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   