import * as fs from 'fs';
import express from 'express';
import os from 'os';
import path from 'path';

const app =  express();
const port = 8080;
app.use(express.static(path.join(os.homedir,'indexPage','target')));
app.listen(port);

