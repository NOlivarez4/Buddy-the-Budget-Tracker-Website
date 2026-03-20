const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
        return;

    } else if (req.url === '/api') {
        fs.readFile(path.join(__dirname, 'public', 'db.json'),
            (err, content) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(content);
            }
        );
        return;

    } else if (req.url.startsWith('/images/')) {
        fs.readFile(path.join(__dirname, 'public', req.url),
            (err, content) => {
                if (err) {
                    res.writeHead(404);
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    res.end(content);
                }
            }
        );
        return;
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }

});

server.listen(5959, () => console.log("Website Complete"));
