//Require Modules
const url = require('url');
const path = require('path');
const fs = require('fs');

//File Imports
const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./maincontent.js');
//Base Path
const staticBasePath = path.join(__dirname, '..', 'static');
//Respond Function
const respond = (request, response) => {

    let pathname = (url.parse(request.url, true).pathname);

    if(pathname == '/favicon.ico'){
        return false;
    }

    pathname = decodeURIComponent(pathname);

    const fullStaticPath = path.join(staticBasePath, pathname);

    if(!fs.existsSync(fullStaticPath)){
        console.log(`${fullStaticPath} does not exist`);
        response.write('404 File not found!');
        response.end();
        return false;
    }
    //if found is a directory
    let stats;
    try {
        stats = fs.lstatSync(fullStaticPath);
    }catch(err){
        console.log(`While checking if it is a directory found error: ${err}`);
    }
    if(stats.isDirectory)
    {
        let data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');

        //Page Title
        let pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        const folderName = pathElements[0];

        //BreadCrumb
        const breadcrumb = buildBreadcrumb(pathname);

        //Table
        const main_content = buildMainContent(fullStaticPath, pathname);

        if (folderName !== undefined)
        {
            data = data.replace('page_title', folderName);
        }else {
            data = data.replace('page_title', 'Home');
        }
        data = data.replace('pathname', breadcrumb);
        data = data.replace('mainContent', main_content);

        //Print Data
        response.statusCode = 200;
        response.write(data);
        return response.end();
    }
        //Not a D or F
    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access Denied!');
        console.lod('Not a file');
        return response.end();
    }

    let fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);
    console.log(fileDetails.extname);
    //Get content from template

}
module.exports = respond;
