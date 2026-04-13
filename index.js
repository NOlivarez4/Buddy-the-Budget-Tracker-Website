const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const http = require("http");
const path = require("path");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log("ENV:", process.env.MONGODB_URI);

const client = new MongoClient(uri);

let buddyCollection;
async function connectDB() {
    try {
        await client.connect();
        buddyCollection = client.db("buddydb").collection("buddyData");
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        process.exit(1);
    }
}
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    }
    else if (req.url === '/about') {
        fs.readFile(path.join(__dirname, 'public', 'about.html'),
            (err, content) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    }
    else if (req.url === '/api' && req.method === 'GET') {
        buddyCollection.find({}).toArray()
            .then(results => {
                const output = results.length === 1 ? results[0] : results;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(output));
            })
            .catch(err => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to fetch buddy data" }));
            });
    }
    else if (req.url === '/api' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const buddyItem = JSON.parse(body);
            buddyCollection.insertOne(buddyItem)
                .then(result => {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                })
                .catch(err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Failed to add buddy data" }));
                });
        });
    }
    else if (req.url.startsWith('/api/') && req.method === 'PUT') {
        const id = req.url.split('/')[2];

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {

            const updates = JSON.parse(body);
            console.log(updates);

            buddyCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updates }
            ).then(result => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }).catch(err => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to update buddy data" }));
            });

        });

    }

    else if (req.url.startsWith('/api/') && req.method === 'DELETE') {
        const id = req.url.split('/')[2];
        buddyCollection.deleteOne({ _id: new ObjectId(id) })
            .then(result => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            })
            .catch(err => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to delete buddy data" }));
            });
    }
    else if (req.url.startsWith('/images/')) {
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
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("<h1>404 Page Not Found</h1>");
    }
});
const PORT = process.env.PORT || 5959;

connectDB().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
