import Rect from "../Rect";
import robot from "robotjs";
import fs from "fs";
import PromptService from "../tool/PromptService";

async function savePositions () {
    return new Promise(async (resolve, reject) => {
        await PromptService.askQuestion("Put your mouse on the top left corner of the cards area and press enter to continue");
        const topLeft = robot.getMousePos();
        await PromptService.askQuestion("Put your mouse on the bottom right corner of the cards area and press enter to continue");
        const bottomRight = robot.getMousePos();

        const cardsArea = new Rect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
        const positions = {cardsArea};
        fs.writeFileSync("positions.json", JSON.stringify(positions));
        resolve(positions);
    });
}

export default savePositions;