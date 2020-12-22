"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs-node"));
var tfjs_node_1 = require("@tensorflow/tfjs-node");
var robot = __importStar(require("robotjs"));
var fs_1 = __importDefault(require("fs"));
var PromptService_1 = __importDefault(require("./src/tool/PromptService"));
var Vector_1 = __importDefault(require("./src/Vector"));
var ImageService_1 = __importDefault(require("./src/image/ImageService"));
var IMAGE_WIDTH = 1024;
var IMAGE_HEIGHT = 768;
var IMAGE_CHANNELS = 3;
var NUM_OUTPUT_CLASSES = 2;
var BATCH_SIZE = 2;
var EPOCH = 1;
function resizeWindow(topLeftGameScreen, size) {
    return __awaiter(this, void 0, void 0, function () {
        var bottomRightGameScreen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Resize window to 1024*768
                return [4 /*yield*/, PromptService_1.default.askQuestion("Put your mouse on the bottom right corner of game area and press enter to continue")];
                case 1:
                    // Resize window to 1024*768
                    _a.sent();
                    bottomRightGameScreen = robot.getMousePos();
                    robot.moveMouse(bottomRightGameScreen.x, bottomRightGameScreen.y);
                    robot.mouseToggle("down");
                    robot.moveMouseSmooth(topLeftGameScreen.x + size.x, topLeftGameScreen.y + size.y, 16);
                    robot.mouseToggle("up");
                    return [2 /*return*/];
            }
        });
    });
}
function getPositions() {
    return __awaiter(this, void 0, void 0, function () {
        function promptForPositions() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            PromptService_1.default.askQuestion("Put your mouse on the top left corner of game area and press enter to continue").then(function () {
                                var topLeftGameScreen = robot.getMousePos();
                                var positions = { topLeftGameScreen: topLeftGameScreen };
                                fs_1.default.writeFileSync("positions.json", JSON.stringify(positions));
                                resolve(positions);
                            });
                        })];
                });
            });
        }
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var positions, shouldReconfig, e_1, shouldResize;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 4, , 6]);
                                positions = JSON.parse(fs_1.default.readFileSync("./positions.json").toString());
                                return [4 /*yield*/, PromptService_1.default.askQuestion("Positions found. Would you like to reconfigure them ? (y/N) ")];
                            case 1:
                                shouldReconfig = _a.sent();
                                if (!(shouldReconfig.toLowerCase().includes("y"))) return [3 /*break*/, 3];
                                return [4 /*yield*/, promptForPositions()];
                            case 2:
                                positions = _a.sent();
                                _a.label = 3;
                            case 3: return [3 /*break*/, 6];
                            case 4:
                                e_1 = _a.sent();
                                return [4 /*yield*/, promptForPositions()];
                            case 5:
                                positions = _a.sent();
                                return [3 /*break*/, 6];
                            case 6: return [4 /*yield*/, PromptService_1.default.askQuestion("Should the screen be resized ? (y/N) ")];
                            case 7:
                                shouldResize = _a.sent();
                                if (!shouldResize.toLowerCase().includes("y")) return [3 /*break*/, 9];
                                return [4 /*yield*/, resizeWindow(positions.topLeftGameScreen, new Vector_1.default(IMAGE_WIDTH, IMAGE_HEIGHT))];
                            case 8:
                                _a.sent();
                                _a.label = 9;
                            case 9:
                                resolve(positions);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function getModel() {
    var model = tf.sequential();
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
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
    // Repeat another conv2d + maxPooling stack.
    // Note that we have more filters in the convolution.
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'selu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
    // Now we flatten the output from the 2D filters into a 1D vector to prepare
    // it for input into our last layer. This is common practice when feeding
    // higher dimensional data to a final classification output layer.
    model.add(tf.layers.flatten());
    model.add(tf.layers.dropout({ rate: 0.5 }));
    // Our last layer is a dense layer which has NUM_OUTPUT_CLASSES output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
    model.add(tf.layers.dense({
        units: NUM_OUTPUT_CLASSES,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }));
    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    var optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    return model;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function data() {
            var i, imageBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < datasetImages.length)) return [3 /*break*/, 4];
                        imageBuffer = fs_1.default.readFileSync(path + "/" + classes[datasetClasses[i]] + "/" + datasetImages[i]);
                        return [4 /*yield*/, tf.node.decodeImage(imageBuffer, IMAGE_CHANNELS)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }
        function labels() {
            var i, classNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < datasetImages.length)) return [3 /*break*/, 4];
                        classNumber = datasetClasses[i];
                        return [4 /*yield*/, tf.oneHot(tf.tensor1d([classNumber], 'int32'), classes.length)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }
        var positions, model, path, classes, classLengths, minClassFiles, imagePaths, datasetImages, datasetClasses, i, randomClass, randomImage, xs, ys, ds;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPositions()];
                case 1:
                    positions = _a.sent();
                    model = getModel();
                    path = "./trainingData/validated";
                    classes = fs_1.default.readdirSync(path);
                    classLengths = classes.map(function (c) { return fs_1.default.readdirSync(path + "/" + c).length; });
                    minClassFiles = Math.min.apply(Math, classLengths);
                    imagePaths = classes.map(function (c) { return fs_1.default.readdirSync(path + "/" + c); });
                    datasetImages = [];
                    datasetClasses = [];
                    for (i = 0; i < minClassFiles; i++) {
                        randomClass = Math.floor(Math.random() * classes.length);
                        randomImage = imagePaths[randomClass][Math.floor(Math.random() * imagePaths[randomClass].length)];
                        datasetImages.push(randomImage);
                        datasetClasses.push(randomClass);
                    }
                    xs = tf.data.generator(data);
                    ys = tf.data.generator(labels);
                    ds = tf.data.zip({ xs: xs, ys: ys }).shuffle(datasetImages.length).batch(BATCH_SIZE);
                    // Train the model for 5 epochs.
                    model.fitDataset(ds, { epochs: EPOCH, callbacks: tf.node.tensorBoard('./tmp/fit_logs_1') }).then(function (info) { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('Accuracy', info.history.acc);
                                    _loop_1 = function () {
                                        var image, tfi, tensor, values, tensorAsArray, onehot_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, ImageService_1.default.getCroppedScreenBuffer({
                                                        x: positions.topLeftGameScreen.x,
                                                        y: positions.topLeftGameScreen.y,
                                                        width: IMAGE_WIDTH,
                                                        height: IMAGE_HEIGHT
                                                    })];
                                                case 1:
                                                    image = _a.sent();
                                                    tfi = tf.node.decodeImage(image, IMAGE_CHANNELS);
                                                    tensor = model.predict(tf.expandDims(tfi));
                                                    if (!(tensor instanceof tfjs_node_1.Tensor)) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, tensor.array()];
                                                case 2:
                                                    values = _a.sent();
                                                    if (typeof values === "object" && !!values.map) {
                                                        tensorAsArray = values;
                                                        onehot_1 = tensorAsArray[0].map(function (v) { return Math.floor(v * 2); });
                                                        classes.forEach(function (c, i) {
                                                            if (onehot_1[i]) {
                                                                console.log(c);
                                                            }
                                                        });
                                                    }
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (!true) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_1()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
main();
