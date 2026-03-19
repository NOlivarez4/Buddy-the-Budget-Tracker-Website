const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    fs.readFile(path.join(__dirname, 'public', 'index.html'),
        (err, content) => {
            if (err) throw err;


            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content);
        }


    );

    if (req.url === '/api') {
        fs.readFile(path.join(__dirname, 'public', 'db.json'),
            (err, content) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(content);
            }
        );
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }

});



server.listen(5959, () => console.log("Website Complete"));
