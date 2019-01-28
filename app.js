const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(express.static(".")); // this solved the path problem in the html file.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// GET
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/flyroom', (req, res) => {
    res.sendFile(__dirname + '/server.html');
});

const port = process.env.PORT || 5000;

var loggedUserIds = [];

io.on('connection', (socket) => {
    console.log('User is connected.');

    const connectionCount = io.engine.clientsCount;
    io.emit('loginCount', connectionCount);

    
    // 1. Display logged user name.
    socket.on('logIn', (data, callback) => {
        const logInMsg = `${data.name} joined the room.`;
        socket.broadcast.emit('broadcast login', logInMsg);

        // Store users connected.
        loggedUserIds.push(data);
        callback(); // no parameter = no error. Callback function definition is in chattyfly-client.js
    });

    socket.on('logOut', (data) => { // this doesn't mean Socket is disconnected.
        const logOutMsg = `${data.user} left the room.`;

        // console.log(logOutMsg);
        socket.broadcast.emit('broadcast logout', logOutMsg);
    });

    // 2. Capture chat messages
    socket.on('newchatfly', (data) => {
        // sending to all clients except sender
        socket.broadcast.emit('broadcast message', data);
    });

    // 3. Disconnect from the socket
    socket.on('disconnect', () => {
        console.log('User was disconnected.');
        const disconnectedId = socket.id;
        
        // console.log(disconnectedId);
        // console.log(loggedUserIds);
        // console.log(loggedUserIds[0].id, loggedUserIds[0].name);


        // Update the number of people online.
        io.emit('loginCount', connectionCount);
    });
});


server.listen(port, () => {
    console.log(`Server running on ${port}`);
});
