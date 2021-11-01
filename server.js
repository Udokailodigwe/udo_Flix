//Declared variables for the imported module. 
const http = require('http'),
    fs = require('fs'),
    url = require('url');

//Setup server by combining modules with http function.
http.createServer(function (request, response) {//Passed two objects in http function.

    //Get and read url requests.
    let addr = request.url,//Get requested url using object called from http function.
        q = url.parse(addr, true),//Objectify the url string into different properties.
        filePath = '';//Filepath sections will be stored here.

    //Created log request record.   
    fs.appendFile('log.txt', 'URL: ' + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log');
        }
    });

    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    //Returning appriopriate file
    fs.readFile(filePath, (err, data) => {//Grabbing the appropriate file from the server through filepath.
        if (err) {
            throw err;
        }

        response.writeHead(200, { 'content-Type': 'text/html' });
        response.write(data);
        response.end();//Return response by http server.
    });
}).listen(8080);//Listening for request on the this port.
console.log('My test server is running on port 8080.');