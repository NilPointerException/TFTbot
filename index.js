const vision = require('@google-cloud/vision');

var robot = require("robotjs");
robot.setMouseDelay(200);

async function getText() {
	return new Promise( async (resolve, reject) => {
		const client = new vision.ImageAnnotatorClient();

		const fileName = './resources/tftExample.jpg';

		// Performs text detection on the local file
		const [result] = await client.textDetection(fileName);
		const detections = result.textAnnotations;
		var warlordsPositions = [];

		detections.forEach(text => {
			if (text.description.toLowerCase() == "yordle") {
				console.log(text.description);
				console.log(text.boundingPoly.vertices[0])
				warlordsPositions.push(text.boundingPoly.vertices[0]);
			}
		});
		resolve(warlordsPositions);
	})
}

async function main() {

	var warlordsPositions = await getText();
	console.log("-----------");
	console.log(warlordsPositions);

	//Get the mouse position, retuns an object with x and y.
	var mouse=robot.getMousePos();
	console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);

	warlordsPositions.forEach(warlordPos => {
		robot.moveMouse(warlordPos.x,warlordPos.y);
		robot.mouseClick();
	});

}

main();