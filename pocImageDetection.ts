import * as tf from '@tensorflow/tfjs-node'
import {Rank, Sequential, Tensor} from '@tensorflow/tfjs-node'
import * as robot from "robotjs";
import fs from "fs";
import PromptService from "./src/tool/PromptService";
import Vector from "./src/Vector";
import ImageService from "./src/image/ImageService";

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const IMAGE_CHANNELS = 3;
const NUM_OUTPUT_CLASSES = 2;

const BATCH_SIZE = 2;
const EPOCH = 1;

interface IPositions {
    topLeftGameScreen: Vector
}

async function resizeWindow(topLeftGameScreen: Vector, size: Vector) {
    // Resize window to 1024*768
    await PromptService.askQuestion("Put your mouse on the bottom right corner of game area and press enter to continue");
    const bottomRightGameScreen: Vector = robot.getMousePos();
    robot.moveMouse(bottomRightGameScreen.x, bottomRightGameScreen.y);
    robot.mouseToggle("down");
    robot.moveMouseSmooth(topLeftGameScreen.x + size.x, topLeftGameScreen.y + size.y, 16);
    robot.mouseToggle("up");
}

async function getPositions(): Promise<IPositions> {
    async function promptForPositions(): Promise<IPositions> {
        return new Promise((resolve) => {
            PromptService.askQuestion("Put your mouse on the top left corner of game area and press enter to continue").then(() => {
                const topLeftGameScreen: Vector = robot.getMousePos();

                const positions = {topLeftGameScreen};
                fs.writeFileSync("positions.json", JSON.stringify(positions));
                resolve(positions);
            });
        });
    }

    return new Promise(async (resolve) => {
        let positions: IPositions;

        try {
            positions = JSON.parse(fs.readFileSync("./positions.json").toString());

            const shouldReconfig: string = await PromptService.askQuestion("Positions found. Would you like to reconfigure them ? (y/N) ");
            if ((shouldReconfig.toLowerCase().includes("y"))) {
                positions = await promptForPositions();
            }
        } catch (e) {
            positions = await promptForPositions();
        }

        const shouldResize: string = await PromptService.askQuestion("Should the screen be resized ? (y/N) ");
        if (shouldResize.toLowerCase().includes("y")) {
            await resizeWindow(positions.topLeftGameScreen, new Vector(IMAGE_WIDTH, IMAGE_HEIGHT));
        }

        resolve(positions);
    });
}

function getModel() {
    const model: Sequential = tf.sequential();

    // In the first layer of our convolutional neural network we have
    // to specify the input shape. Then we specify some parameters for
    // the convolution operation that takes place in this layer.
    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNELS],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'selu',
        kernelInitializer: 'varianceScaling'
    }));

    // The MaxPooling layer acts as a sort of downsampling using max values
    // in a region instead of averaging.
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    // Repeat another conv2d + maxPooling stack.
    // Note that we have more filters in the convolution.
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'selu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    // Now we flatten the output from the 2D filters into a 1D vector to prepare
    // it for input into our last layer. This is common practice when feeding
    // higher dimensional data to a final classification output layer.
    model.add(tf.layers.flatten());

    model.add(tf.layers.dropout({rate: 0.5}));

    // Our last layer is a dense layer which has NUM_OUTPUT_CLASSES output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
    model.add(tf.layers.dense({
        units: NUM_OUTPUT_CLASSES,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }));

    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
}

async function main() {
    const positions = await getPositions();
    //ActionService.mouseMove(positions.topLeftGameScreen);

    const model = getModel();

    const path = "./trainingData/validated";
    const classes: string[] = fs.readdirSync(path);
    const classLengths: number[] = classes.map((c) => fs.readdirSync(`${path}/${c}`).length);
    const minClassFiles: number = Math.min(...classLengths);
    const imagePaths: string[][] = classes.map((c) => fs.readdirSync(`${path}/${c}`));
    const datasetImages: string[] = [];
    const datasetClasses: number[] = [];

    for (let i = 0; i < minClassFiles; i++) {
        const randomClass: number = Math.floor(Math.random() * classes.length);
        const randomImage: string = imagePaths[randomClass][Math.floor(Math.random() * imagePaths[randomClass].length)];
        datasetImages.push(randomImage);
        datasetClasses.push(randomClass);
    }

    function* data() {
        for (let i = 0; i < datasetImages.length; i++) {
            // Generate one sample at a time
            const imageBuffer = fs.readFileSync(`${path}/${classes[datasetClasses[i]]}/${datasetImages[i]}`);
            yield tf.node.decodeImage(imageBuffer, IMAGE_CHANNELS);
        }
    }

    function* labels() {
        for (let i = 0; i < datasetImages.length; i++) {
            // Generate one sample at a time
            const classNumber: number = datasetClasses[i];
            yield tf.oneHot(tf.tensor1d([classNumber], 'int32'), classes.length);
        }
    }


    const xs = tf.data.generator(data);
    const ys = tf.data.generator(labels);

    // We zip the data and labels together, shuffle and batch 8 samples at a time.
    const ds = tf.data.zip({xs, ys}).shuffle(datasetImages.length).batch(BATCH_SIZE);

    // Train the model for 5 epochs.
    model.fitDataset(ds, {epochs: EPOCH, callbacks: tf.node.tensorBoard('./tmp/fit_logs_1')}).then(async (info) => {
        console.log('Accuracy', info.history.acc);

        while (true) {
            const image = await ImageService.getCroppedScreenBuffer({
                x: positions.topLeftGameScreen.x,
                y: positions.topLeftGameScreen.y,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT
            });

            const tfi: Tensor<Rank.R3> | Tensor<Rank.R4> = tf.node.decodeImage(image, IMAGE_CHANNELS);
            const tensor: Tensor<Rank> | Tensor[] = model.predict(tf.expandDims(tfi));

            if (tensor instanceof Tensor) {
                const values = await tensor.array();
                if (typeof values === "object" && !!values.map) {
                    const tensorAsArray: Array<any> = values;
                    const onehot = tensorAsArray[0].map((v: number) => Math.floor(v * 2));
                    classes.forEach((c, i) => {
                        if (onehot[i]) {
                            console.log(c);
                        }
                    });
                }
            }
        }
    });


    /*
        ImageService.saveScreenRectToFile({
            x: positions.topLeftGameScreen.x,
            y: positions.topLeftGameScreen.y,
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT
        }, "trainingData/unsorted/" + Date.now() + ".png");
      */
}

main();