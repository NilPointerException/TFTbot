const vision = require('@google-cloud/vision');

const sharp = require('sharp');
const robot = require("robotjs");
const ghostcursor = require("ghost-cursor");
const fs = require("fs");
const savePosition = require('./savePositions');

const client = new vision.ImageAnnotatorClient();
let positions = null;

console.log(positions);


robot.setMouseDelay(26);
robot.setKeyboardDelay(54);

async function takeScreenshot() {
    // Taking screenshot
    return new Promise(async (resolve, reject) => {
        const screenshot = require('screenshot-desktop')

        screenshot({format: 'png'}).then((img) => {
            resolve(img);
        }).catch((err) => {
            reject(err);
        })

    });
}

async function cropImageToBuffer(image, width, height, left, top) {
    return new Promise((resolve, reject) => {
        sharp(image).extract({width, height, left, top}).toBuffer()
            .then(function (imagebuffer) {
                resolve(imagebuffer);
                console.log("Image cropped");
            })
            .catch(function (err) {
                console.log("An error occured: " + err);
                reject(err);
            });
    })
}

async function cropImageToFile(image) {
    return new Promise((resolve, reject) => {
        sharp(image).extract({width: 2000, height: 440, left: 100, top: 1000}).toFile(Date.now() + ".jpg")
            .then(function (imagebuffer) {
                console.log("Image cropped");
                resolve();
            })
            .catch(function (err) {
                console.log("An error occured: " + err);
                reject();
            });
    })
}

async function getText() {
    return new Promise(async (resolve, reject) => {
        let screenshot = await takeScreenshot();
        let imageBuffer = await cropImageToBuffer(
            screenshot,
            positions.bottomRight.x - positions.topLeft.x,
            positions.bottomRight.y - positions.topLeft.y,
            positions.topLeft.x,
            positions.topLeft.y);

        // Performs text detection on the local file
        const [result] = await client.textDetection(imageBuffer);
        const detections = result.textAnnotations;
        var warlordsPositions = [];

        detections.forEach(text => {
            if (text.description.toLowerCase() === "guerre") {
                warlordsPositions.push({
                    x: text.boundingPoly.vertices[0].x + positions.topLeft.x,
                    y: text.boundingPoly.vertices[0].y + positions.topLeft.y
                });
            }
        });

        resolve(warlordsPositions);
    })
}

async function main() {
    try {
        positions = require("./positions.json");
    } catch (e) {
        positions = await savePosition();
    }

    setInterval(async () => {
        console.time("Time needed");
        var warlordsPositions = await getText();
        console.log("-----------");
        console.log(warlordsPositions);

        warlordsPositions.forEach((warlordPos, i) => {
            setTimeout(()=>{
                warlordPos.x += (Math.random() * 45) - 20;
                warlordPos.y += (Math.random() * 49) - 18;
                moveCursorLikeHuman(warlordPos)

                setTimeout(() => {
                    // robot.mouseClick("left", true);
                    robot.mouseClick("left");

                    /*setTimeout(()=>{
                        moveCursorLikeHuman({x: 1200 + Math.random() * 100, y: 700 + Math.random() * 100});

                    },(Math.random() * 100) + 20 );

                    robot.mouseClick("left");
                     */
                }, (Math.random() * 20) + 20)
                console.log("Click on buy");
            }, ((Math.random() * 300) + 20)*i);
        });

        console.log("refreshing the board");
        robot.keyTap("d");
        setTimeout(() => {
            robot.keyTap("d");
        }, (Math.random() * 100) + 20)
        console.timeEnd("Time needed");
    }, 3500);
}

function moveCursorLikeHuman(to) {
    const mouse = robot.getMousePos()
    const route = ghostcursor.path(mouse, to)

    for (let element of route) {
        robot.moveMouse(element.x, element.y);
    }
}

main();
