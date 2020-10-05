const {execSync} = require('child_process');

const calculateSizeD = itemFullStaticPath => {
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g,'\ ');
    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();

    let filesize = commandOutput.replace(/\s/g, '');
    filesize = filesize.split('/');
    filesize = filesize[0];

    const filesizeUnit = filesize.replace(/\d|\./g,'');
    const filesizeNumber = parseFloat(filesize.replace(/[a-z]/i,''));
    const units = "BKMGT";

    const filesizeBytes = filesizeNumber * Math.pow(1024, units.indexOf(filesizeUnit));

    return [filesize, filesizeBytes];
};

module.exports = calculateSizeD;