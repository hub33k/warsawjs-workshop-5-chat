const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

socket.on('message', (msg) => {
    clearPrompt();
    console.log(`>> ${msg}`);
    readline.prompt();
});

console.log('Client connected.');

// get message from client
readline.on('line', (line) => {
    if (line.trim()) {
        socket.emit('message', line);
    }
    readline.prompt();
});

readline.prompt();
