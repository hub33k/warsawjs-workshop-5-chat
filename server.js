const io = require('socket.io');
const server = io(); // socket

const USERS = {};

function handleMessage(client) {
    return (msg) => {
        console.log(msg);
        client.broadcast.emit('message', msg); // send msg to all clients
    }
}

// same as above
// function handleMessage(client) {
//     function callback(msg) {
//         console.log(msg);
//         client.broadcast.emit('message', msg); // send msg to all clients
//     }
//
//     return callback;
// }

function handleRegister(client) {
    return (userObject) => {
        if (USERS[userObject.username]) {
            client.emit('register', false);
        } else {
            USERS[userObject.username] = {
                password: userObject.password,
                logged_in: false,
            };
            client.emit('register', true);
        }

    }
}

function handleLogin(client) {
    return (userObject) => {
        const user = USERS[userObject.username];

        if (user.password === userObject.password) {
            user.logged_in = true;
            client.emit('login', userObject.username);
        } else {
            client.emit('login', false);
        }
    }
}

function handleLogout(username) {
    USERS[username].logged_in = false;
}


server.on('connection', (client) => {
    console.log(`Hello, your id: ${client.id}`);

    client.on('message', handleMessage(client));

    client.on('register', handleRegister(client));

    client.on('login', handleLogin(client));

    client.on('logout', handleLogout);
});

server.listen(3000);
