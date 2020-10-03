const { SlowBuffer } = require('buffer');
const child_process = require('child_process');

try{
    const result = child_process.execSync("du -sh 'pwd'").toString();
    console.log(result);
}catch(err){
    console.log(`Error: ${err}`);
}
