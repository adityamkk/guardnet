'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');
const urlObject = require('url');
const { Console } = require("console");
const { Hash } = require('crypto');
const sqlite3 = require('sqlite3');
const hostname = 'localhost';
const port = 8000;

/*
 *  LOGGER
 */

const logger = new Console({
    stdout: fs.createWriteStream("log.txt"),
    stderr: fs.createWriteStream("error.txt"),
});
var db = new sqlite3.Database('guardnet.db');

db.run("CREATE TABLE if not exists users(id integer, username varchar(200), password varchar(200), school varchar(200))");
db.run("CREATE TABLE if not exists schools(id integer, name varchar(200), address varchar (100), city varchar (50), state varchar(2))");
db.run("CREATE TABLE if not exists rooms(id integer, name varchar(200), school varchar(200), floor integer)");
db.run("CREATE TABLE if not exists alerts(id integer, name varchar(200), school varchar(200), floor integer, time varchar(200))");


/*
 *  FUNCTIONS
 */

function serveUI(req, res) {
    // parse URL
    const parsedUrl = urlObject.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // maps file extension to MIME typere
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };

    fs.exists(pathname, function (exist) {
        if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        // if is a directory search for index file matching the extension
        if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', map[ext] || 'text/plain');
                res.end(data);
            }
        });
    });

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateHash(username, password, salt) {
    return username + password + salt;
}

function verifyHash(salt, hash) {
    return true;
}

function getTime(currentdate) {
    let datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}

/*
 *  CLASS DEFINITIONS
 */

class Alert {
    constructor(date, location) {
        this.date = getTime(date);
        this.location = location;
    }

    toString() {
        return `${date} : ${this.location}`;
    }
}

class Location {
    constructor(name, floor) {
        this.name = name;
        this.floor = floor;
    }
}

/*
 *  DATA
 */


/*
 *  SERVER RESPONSE
 */

const server = http.createServer((req, res) => {

    //Finds the url
    const url = new URL(req.url, `http://${hostname}:${port}`);

    let datetime = getTime(new Date());
    logger.log(`${datetime} : Request recieved for ${url}`);

    const params = {
        username: url.searchParams.get('username'),
        password: url.searchParams.get('password'),
        school: url.searchParams.get('school'), 
        location: url.searchParams.get('location'),
        floornumber: url.searchParams.get('floornumber'),
        roomname: url.searchParams.get('roomname'),
    }

    //Different responses based on different urls
    switch (url.pathname) {
        // Verifies if a login is valid; if it is, sets a cookie for that administrator
        case '/verifylogin':
            logger.log("VERIFYLOGIN");
            db.all("SELECT * FROM users where username = ?", [params.username], async (err, data) => {
                if(data[0]){
                if (params.password == data[0].password) {
                    const salt = getRandomInt(1000000);
                    // res.setHeader("Set-Cookie", cookie.serialize(salt, generateHash(params.username, params.password, salt)));

                    res.setHeader("Set-Cookie", [`salt=${salt}; path=/`, `user=${params.username}; path=/`, `school=${data[0].school}; path=/`]);
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000', 'Access-Control-Allow-Credentials': true });
                    res.write(JSON.stringify({ loginStatus: 1 }));
                  
                    res.end();
                    
                    logger.log("Logged In Successfully!");
                } else {
                    //res.setHeader('Set-Cookie',[`code=${0}; path=/`,`name=${0}; path=/`]);
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.write(JSON.stringify({ loginStatus: 0 }));
                    res.end();
                    logger.log("Login Failed!");
                }
            }
            })
            break;
        case '/newaccount':
            logger.log("NEWACCOUNT");
            db.run('insert into users(username, password, school) values(?,?,?)', [params.username, params.password, params.school]);
            const salt = getRandomInt(1000000);
            res.writeHead(200, {
                "Set-Cookie": [`salt=${salt}; path=/`, `token=${generateHash(params.username, params.password, salt)}; path=/`],
                "Content-Type": `text/plain`
            });
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.write(JSON.stringify({ loginStatus: 1 }));
                    res.end();
            break;
        case '/generateQRCode':
                logger.log("GENERATE QR CODE");
                        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                        res.write(JSON.stringify({ roomname: params.roomname, school: params.school }));
                        res.end();
        break;
        // Adds a new room to the list of rooms
        case '/addnewroom':
            logger.log("ADDNEWROOM");
            if (verifyHash(1000, 100000)) {
                db.all("SELECT * FROM rooms where school = ?", ["Test School"], async (err, rooms) => {
                    for(const room in rooms) {
                        if(params.roomname == room.name) {
                            res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                            res.end();
                            logger.log("Error: duplicate room names not permissible");
                            break;
                        }
                    }
                });
                db.run('insert into rooms(name, school, floor) values(?,?,?)', [params.roomname, "Test School", params.floornumber]);
                db.all("SELECT * FROM rooms where school = ?", ["Test School"], async (err, rooms) => {
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.write(JSON.stringify({ rooms: rooms }));
                    res.end();
                    logger.log("Room Added!");
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end();
                logger.log("Failiure - not allowed in");
            }
            break;
        // Removes a room from the list of rooms
        case '/removeroom':
            logger.log("REMOVEROOM");
            if (verifyHash(1000, 100000)) {
                db.run('delete from rooms where school=(?) and name=(?)', ["Test School", params.roomname]);
                db.all("SELECT * FROM rooms where school = ?", ["Test School"], async (err, rooms) => {
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true'  });
                    res.write(JSON.stringify({ rooms: rooms }));
                    logger.log("Room Deleted!");
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end();
                logger.log("Failiure - not allowed in");
            }
            break;
        // Returns all rooms in a specific school
        case '/getrooms':
            console.log(res.getHeader("Set-Cookie"))

            logger.log("GETROOM");
            if(verifyHash(1000, 10000)) {
                db.all("SELECT * FROM rooms where school = ?", ["Test School"], async (err, rooms) => {
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' });
                    res.write(JSON.stringify({ rooms: rooms }));
                    res.end();
                    logger.log("Got the rooms!");
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end();
                logger.log("Failiure - not allowed in");
            }
            break;
        case '/alert':
            logger.log("ALERT");
            
            db.all("SELECT * FROM rooms where school = ? and name = ?", ["Test School", params.roomname], async (err, rooms) => {
                if(rooms.length > 0) {
                    logger.log("FLOORNUMBER inside = " + rooms[0].floor);
                    db.run('insert into alerts(name, school, floor, time) values(?,?,?,?)', [params.roomname, "Test School", rooms[0].floor, new Date()]);
                    res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                    res.write("<html><body><h1>Thank you! Your Request has been submitted to Guardnet</h1></body></html>");
                    res.end();
                    //Add additional functionality here...
                    logger.log("Alert Recieved");
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                    res.write("<html><body><h1>404 Oops! Something went wrong...</h1></body></html>");
                    res.end();
                }
            });
            break;
        // Clears all alerts from database for a particular school
        case '/clearalerts':
            logger.log("CLEARALERTS");
            db.run('delete from alerts where school=(?)', ["Test School"]);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.write(JSON.stringify({ success: 1 }));
            res.end();
            logger.log("Alerts Deleted!");
            break;
        case '/getwarnings':
            logger.log("GETWARNINGS");
            if (verifyHash(1000, 10000)) {
                db.all("SELECT * FROM alerts where school = ?", ["Test School"], async (err, alerts) => {
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.write(JSON.stringify({ alerts: alerts }));
                    res.end();
                    logger.log("Alerts have been sent");
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end();
                logger.log("Failiure - not allowed in");
            }
            break;
        default:
            serveUI(req, res);
    }
});

//Server Listen
server.listen(port, hostname, () => {
    logger.log(`Server running at http://${hostname}:${port}/`);
});
