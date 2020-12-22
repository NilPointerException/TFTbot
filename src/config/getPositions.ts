import savePositions from "./savePositions";
import Rect from "../Rect";

async function getPositions(): Promise<{ cardsArea: Rect }> {
    return new Promise(async (resolve) => {
        let positions;
        try {
            positions = require("./positions.json");
        } catch (e) {
            positions = await savePositions();
        }

        resolve(positions);
    });
}

export default getPositions;