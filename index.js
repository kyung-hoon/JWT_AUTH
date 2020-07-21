import * as fs from 'fs-extra';
import express from 'express';
import os from 'os';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 8080;
app.use(cors());
app.use(express.static(path.join(os.homedir(), 'indexPage', 'target')));
app.listen(port);
console.log('express listening on port : 8080');


app.use(express.json());

app.post('/create', (req, res) => {
    const name = req.body.workspaceName;
    const dirLocation = path.join(os.homedir(), 'TopWebStudio', name);
    if (!fs.existsSync(dirLocation)) {
        fs.mkdirSync(dirLocation, { recursive: true });
        const lastModified = fs.statSync(dirLocation).mtime.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }).replace(/T/, ' ').replace(/\..+/, '');
        if (!fs.existsSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'))) {
            let workSpaceArray = new Array();
            const workSpaceObejct = {
                name: name,
                location: dirLocation,
                lastModified: lastModified
            }
            workSpaceArray.push(workSpaceObejct);
            const content = {
                "workspaces": workSpaceArray
            }
            fs.writeFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(content));
            res.send(content);
        } else {
            const content = fs.readFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'));
            let workSpaceArray = JSON.parse(content).workspaces;
            const workSpaceObejct = {
                name: name,
                location: dirLocation,
                lastModified: lastModified
            }
            workSpaceArray.push(workSpaceObejct);
            const updatedContent = {
                "workspaces": workSpaceArray
            }
            console.log(updatedContent);
            fs.writeFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(updatedContent));
            res.send(updatedContent);
        }

    } else {
        res.status(500).send('workspace already exists');
    }

});

app.post('/remove', (req, res) => {
    const name = req.body.workspaceName;
    const dirLocation = path.join(os.homedir(), 'TopWebStudio', name);
    fs.rmdirSync(dirLocation, { recursive: true });
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
    res.send(updatedContent);
});


app.get('/getWorkspaces', (req, res) => {
    if (!path.join(os.homedir(), 'TopWebStudio', 'workspace.json')){
        const workSpaceArray = new Array();
        const content = {
            workspaces : workSpaceArray
        }
        fs.writeFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(content));
        res.send(content);
    }else{
        const content = fs.readFileSync(path.join(os.homedir(), 'TopWebStudio', 'workspace.json'), JSON.stringify(content));
        res.send(content);
    }
})