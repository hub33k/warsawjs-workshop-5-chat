const io = require('socket.io');
const server = io(); // socket

server.on('connection', (client) => {
    console.log(`Hello, your id: ${client.id}`);

    client.on('message', (msg) => {
        console.log(msg);
        client.broadcast.emit('message', msg); // send msg to all clients
    });
});

console.log('Server started!');

server.listen(3000);
