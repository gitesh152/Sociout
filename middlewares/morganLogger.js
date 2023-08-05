import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import rfs from 'rotating-file-stream';

const logDirectory = path.join(__dirname, '../production_logs');

//Check if production log directory already exist or create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', //one day rotating interval
    path: logDirectory,
});


const morgan = {
    mode: 'combined',
    accessLogStream,
}

export default morgan;