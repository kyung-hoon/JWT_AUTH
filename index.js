import * as fs from 'fs-extra';
import express from 'express';
import os from 'os';
import path from 'path';
import cors from 'cors';
import chalk from 'chalk';


const app = express();
const port = 8080;
app.use(cors());
app.use(express.static(path.join(os.homedir(),  'indexPage')));
app.listen(port);
console.log('express listening on port : 8080');


app.use(express.json());

app.post('/create', (req, res) => {
    const name = req.body.workspaceName;
    console.log(req)

});

app.post('/remove', (req, res) => {
    const name = req.body.workspaceName;
    const dirLocation = path.join(os.homedir(), 'TopWebStudio', name);
    fs.removeSync(dirLocation, { recursive: true });
    const content = fs.readFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'));
    let workSpaceArray = JSON.parse(content).workspaces;
    const index = workSpaceArray.map(function (item) {
        return item.name;
    }).indexOf(name);
    workSpaceArray.splice(index, 1);
    const updatedContent = {
        workspaces: workSpaceArray
    }
    fs.writeFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(updatedContent));
    console.log(chalk.yellow("message : "),updatedContent);
    res.send(updatedContent);
});


app.get('/getWorkspaces', (req, res) => {
    if (!fs.existsSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'))){
        const workSpaceArray = new Array();
        const content = {
            workspaces : workSpaceArray
        }
        fs.writeFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(content));
        console.log(chalk.yellow("message : "),content);
        res.send(content);
    }else{
        const content = fs.readFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(content));
        console.log(chalk.yellow("message : "),content);
        res.send(content);
    }
})


//추후 같은 pod 내에 배포 될시 localhost로 변경
app.post('/open',(req, res)=>{
    const path =req.body.workspaceName;
    const url ={
        url : `192.168.13.120:4000/#${path}`
    } 
    console.log(chalk.yellow("message : "),url);
    res.send(url);
})