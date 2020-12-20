import ActionService from "./src/action/ActionService";
import DetectionService from "./src/image/DetectionService";
import getPositions from "./src/config/getPositions";
import Rect from "./src/Rect";

async function main() {
    const positions: { cardsArea: Rect } = await getPositions();
    console.log(positions);

    setInterval(async () => {
        const warlordsPositions = await DetectionService.getPositionsOfWordInRect("guerre", positions.cardsArea);

        warlordsPositions.forEach((warlordPos) => {
            warlordPos.x += (Math.random() * 45) - 20;
            warlordPos.y += (Math.random() * 49) - 18;
            ActionService.mouseMoveClick(warlordPos);
            console.log("Click on buy");
        });

        console.log("refreshing the board");
        ActionService.keyTap("d");
    }, 3500);
}

main();