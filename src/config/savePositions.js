import Rect from "../Rect";

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

        const cardsArea = new Rect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
        const positions = {cardsArea};
        fs.writeFileSync("positions.json", JSON.stringify(positions));
        resolve(positions);
    });
}