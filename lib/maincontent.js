const fs = require('fs');
const path = require('path');

const calculateSizeD = require('./calculateSizeD.js');
const calculateSizeF = require('./calculateSizeF.js');

const buildMainContent = function(fullStaticPath, pathname) {
    let mainContent = '';
    let items;

    try{
        items = fs.readdirSync(fullStaticPath);
    }catch(err){
        console.log(`readdirSync error: ${err}`);
        return '<div class="alert alert-danger">Internal Server Error</div>';
    }

    items.forEach(item => {

        const link = path.join(pathname, item);
        let itemDetails = {};
        const itemFullStaticPath = path.join(fullStaticPath, item);
        try{
            itemDetails.stats = fs.statSync(itemFullStaticPath);
        }catch(err){
            console.log(`statSync error: ${err}`);
            mainContent = `<div class="alert alert-danger">Internal Server Error</div>`;
            return false;
        }
        if(itemDetails.stats.isDirectory()){

            itemDetails.icon = '<i class="fas fa-folder"></i>';

            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeD(itemFullStaticPath);

        }else if(itemDetails.stats.isFile()){

            itemDetails.icon = '<i class="fas fa-file"></i>';

            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeF(itemDetails.stats);
        }

        itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);
        itemDetails.date = new Date(itemDetails.timeStamp).toLocaleString();
        //last modified date

        mainContent += `
        <tr data-name="${item}" data-size="${itemDetails.sizeBytes}" data-time="${itemDetails.timeStamp}">
        <td>${itemDetails.icon}<a href="${link}">${item}</a></td>
        <td>${itemDetails.size}</td>
        <td>${itemDetails.date}</td>
        </tr>
        `;
    });

    return mainContent;
};

module.exports = buildMainContent;
