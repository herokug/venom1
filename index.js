const { spawn } = require('child_process');
const path = require('path');
const express = require('express');

function start() {
    let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)];
    console.log([process.argv[0], ...args].join('\n'));
    let p = spawn(process.argv[0], args, {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc']
        })
        .on('message', data => {
            if (data == 'reset') {
                console.log('Restarting Bot...');
                p.kill();
                start();
                delete p;
            }
        })
        .on('exit', code => {
            console.error('Exited with code:', code);
            if (code == '.' || code == 1 || code == 0) start();
        });
}

start();

// Express server setup
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
