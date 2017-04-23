const io = require('socket.io');
const server = io(); // socket

server.on('connection', (client) => {
    console.log(`Hello, your id: ${client.id}`);
});

server.listen(3000);
