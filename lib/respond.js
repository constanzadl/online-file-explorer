//Require Modules
const url = require('url');
const path = require('path');
const fs = require('fs');

//File Imports
const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./maincontent.js');
const getMimeType = require('./mimeType.js');
const { extname } = require('path');
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

    if(stats.isDirectory())
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

    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access Denied!');
        console.lod('Not a file');
        return response.end();
    }
    let fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);

    console.log(fileDetails.extname);
    //filesize
    let stat;
    try {
        stat = fs.statSync(fullStaticPath);
    }catch(err){
        console.log(`err: ${err}`);
    }
    fileDetails.size = stat.size;

    getMimeType(fileDetails.extname).then(mime => {
        //Store headers
        let head = {};
        let statusCode = 200;
        head['Content-Type'] = mime;
        let options = {};

        //By Chunks and Promise
        // fs.promises.readFile(fullStaticPath, 'utf-8').then(data => {
        //     response.writeHead(statusCode, head);
        //     response.write(data);
        //     return response.end();
        // }).catch(error => {
        //     console.log(error);
        //     response.statusCode = 404;
        //     response.write('404: File reading error!');
        //     return response.end();
        // });

        if(fileDetails.extname == '.pdf'){
            head['Content-Disposition'] = 'inline';
            //Downloadable
            // head['Content-Disposition'] = 'attachment;filename=file.pdf';
        }
        
        if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
            head['Accept-Ranges'] = 'bytes';
            const range = request.headers.range;
            console.log(range);
            if(range){
                const start_end = range.replace(/bytes=/,'').split('-');
                const start = parseInt(start_end[0]);
                const end = start_end[1] ? parseInt(start_end[1]) : fileDetails.size - 1;
            
                //headers
                //Content-Range
                head['Content-Range'] = `bytes ${start}-${end}/${fileDetails.size}`;
                //Content-Length
                head['Content-Length'] = end - start + 1
                statusCode = 206;

                //options
                options = {start, end};
            }
            
        }
        //By Streaming
        const fileStream = fs.createReadStream(fullStaticPath, options);
        response.writeHead(statusCode, head);
        fileStream.pipe(response);

        //Events
        fileStream.on('close', () => {
            return response.end();
        });
        fileStream.on('error', (error) => {
            console.log(error.code);
            response.statusCode = 404;
            response.write('404: File stream error!');
            return response.end();
        });
    }).catch(err => {
        response.statusCode = 500;
        response.write('500: Internar server error!');
        console.log(`Promise error: ${err}`);
        return response.end();
    });
}
module.exports = respond;
