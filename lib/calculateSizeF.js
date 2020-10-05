const {execSync} = require('child_process');
const fs = require('fs');

const calculateSizeF = stats => {
    const filesizeBytes = stats.size;
    const units = "BKMGT";
    const index = Math.floor(Math.log10(filesizeBytes)/3);
    const filesize = (filesizeBytes/Math.pow(1000,index)).toFixed(1);
    return [`${filesize}${units[index]}`, filesizeBytes];
};

module.exports = calculateSizeF;