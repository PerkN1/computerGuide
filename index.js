const http = require('http');
const path = require('path');
const fs = require('fs');
const { create } = require('domain');

const server = http.createServer((req,res) => {
    // create a dynamic file path
    let filePath = path.join(__dirname, 'public', req.url === '/'?'index.html' : req.url);

    // create dynamic Content-Type using extension of the files to be served
    let extName = path.extname(filePath);

    // Initial Content-Type
    let contentType = 'text/html';

    // check ext and set content type 
    switch (extName) {
        case '.js': 
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png': 
            contentType = 'image/png';
            break;
        case '.jpg': 
            contentType = 'image/jpg';
            break; 
    }



    // Load the files 
    fs.readFile(filePath, (err, content)=>{
        if (err) {
            if (err.code == 'ENOENT') { // page not found
                // Load an error page say 404 html
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err,content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                // some sort of server error like 500
                res.writeHead(500);
                res.end(`Server Error ${err.code}`)
            } 

        } else{ // No error success loading
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    })
});


// Let host decide the port or use 3000
const PORT = process.env.PORT || 3000; 

// Start the server and give the prompt
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));