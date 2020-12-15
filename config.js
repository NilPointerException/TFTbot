const robot = require("robotjs");
const readline = require('readline');
const fs = require('fs');
const savePosition = require('./savePositions');

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function main(){
    savePosition();
}

main();