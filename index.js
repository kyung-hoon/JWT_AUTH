import * as fs from 'fs-extra';
import express from 'express';
import os from 'os';
import path from 'path';

const app =  express();
const port = 8080;
app.use(express.static(path.join(os.homedir(),'indexPage','target')));
app.listen(port);
console.log('express listening on port : 8080');


app.use(express.json());

app.post('/create',(req,res) =>{
    const name = req.body.workspaceName;
    const dirLocation = path.join(os.homedir(),name);
    fs.mkdirSync(dirLocation);
    const lastModified = fs.statSync(dirLocation).mtime.toISOString().replace(/T/, ' '). replace(/\..+/, '');
    if(!fs.existsSync(path.join(os.homedir(),'workspace.json'))) {
        let workSpaceArray = new Array();
        const workSpaceObejct ={
            name: name,
            location: dirLocation,
            lastModified : lastModified
        }
        workSpaceArray.push(workSpaceObejct);
        const content = {
            "workspaces" : workSpaceArray
        }
        fs.writeFileSync(path.join(os.homedir(),'workspace.json'),JSON.stringify(content));
        res.send(content);
    }else{
        const content = fs.readFileSync(path.join(os.homedir(),'workspace.json'));
        let workSpaceArray = JSON.parse(content).workspaces;
        const workSpaceObejct ={
            name: name,
            location: dirLocation,
            lastModified : lastModified
        }
        workSpaceArray.push(workSpaceObejct);
        const updatedContent = {
            "workspaces": workSpaceArray 
        }
        console.log(updatedContent);
        fs.writeFileSync(path.join(os.homedir(),'workspace.json'),JSON.stringify(updatedContent));
        res.send(updatedContent);
    }
    
});

app.post('/remove',(req, res)=>{
    const name = req.body.workspaceName;
    const dirLocation = path.join(os.homedir(),name);
    fs.rmdirSync(dirLocation,{recursive: true});
    const content = fs.readFileSync(path.join(os.homedir(),'workspace.json'));
    let workSpaceArray = JSON.parse(content).workspaces;
    const index = workSpaceArray.map(function(item){
        return item.name;
    }).indexOf(name);
    workSpaceArray.splice(index,1);
    const updatedContent = {
        workspaces: workSpaceArray
    }
    fs.writeFileSync(path.join(os.homedir(),'workspace.json'),JSON.stringify(updatedContent));
    res.send(updatedContent);
});