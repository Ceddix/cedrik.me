require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true
    }
});

var lanyardData = null;
setInterval(() => {
    https.get('https://api.lanyard.rest/v1/users/' + process.env.DISCORD_ID, res => {
        let data = [];
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', chunk => {
            data.push(chunk);
        });

        res.on('end', () => {
            console.log('Response ended: ' + data.toString());
            data = data.toString()
            if (data !== lanyardData) {
                lanyardData = data;
                io.emit('lanyard-data', lanyardData);
            }
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
}, 2000);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/debug', (req, res) => {
    res.send(lanyardData);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('lanyard-data', lanyardData);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log('listening on *:' + process.env.PORT);
});