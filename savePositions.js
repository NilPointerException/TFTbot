const readline = require('readline');
const robot = require("robotjs");
const fs = require('fs');

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

module.exports = async () => {
    return new Promise(async (resolve, reject) => {
        await askQuestion("Put your mouse on the top left corner of the cards area and press enter to continue");
        const topLeft = robot.getMousePos();
        await askQuestion("Put your mouse on the bottom right corner of the cards area and press enter to continue");
        const bottomRight = robot.getMousePos();

        fs.writeFileSync("positions.json", JSON.stringify({topLeft, bottomRight}));
        resolve({topLeft, bottomRight});
    });
}