const io = require('socket.io-client');
const socket = io(`http://${process.argv[2] || 'localhost' }:3000`);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

socket.on('register', (registerSuccess) => {
    clearPrompt();
    if (registerSuccess) {
        console.log('>> Registration success!');
    } else {
        console.log('>> Registration failed!');
    }
    readline.prompt();
});

socket.on('login', (username) => {
    clearPrompt();
    if (username) {
        LOGGED_USER = username;
        readline.setPrompt(`${username}: `);
    } else {
        console.log('>> Login failed!');
    }

    readline.prompt();
});

socket.on('message', (msg) => {
    clearPrompt();
    console.log(`>> ${msg}`);
    readline.prompt();
});

console.log('Client connected.');

let LOGGED_USER = '';

// get message from client
readline.on('line', (line) => {
    const lineArgs = line.split(/\s+/);
    const firstWorld = lineArgs[0];

    if (firstWorld === '/exit' || firstWorld === '/q') {
        readline.close();
        process.exit(0)
    } else if (firstWorld === '/register' || firstWorld === '/r') {
        if (lineArgs.length >= 3) {
            socket.emit('register', {
                username: lineArgs[1],
                password: lineArgs[2],
            });
        }
    } else if (firstWorld === '/login' || firstWorld === '/l') {
        if (lineArgs.length >= 3) {
            socket.emit('login', {
                username: lineArgs[1],
                password: lineArgs[2],
            });
        }
    } else if (firstWorld === '/logout') {
        socket.emit('logout', LOGGED_USER);
        LOGGED_USER = '';
        readline.setPrompt('> ');
    } else if (line.trim()) {
        socket.emit('message', line);
    }

    readline.prompt();
});

readline.prompt();
