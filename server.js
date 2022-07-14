const express = require('express');
const socket = require('socket.io');
const app = express();
const path = require('path');

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000);
});
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('join', (userName) => {
        users.push({ id: socket.id, name: userName });
        socket.broadcast.emit('message', {
            author: 'Chatbot',
            content: `<i>${userName} has joined the conversation!`,
        });
    });
    socket.on('message', (message) => {
        console.log("Oh, I've got something from " + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => {
        if (users.length > 0) {
            userName = users.filter((user) => user.id === socket.id)[0].name;
            users = users.filter((user) => user.id !== socket.id);
            socket.broadcast.emit('message', {
                author: 'Chatbot',
                content: `<i>${userName} has left the conversation... :(`,
            });
        }
    });
    console.log("I've added a listener on message and disconnect events \n");
});
