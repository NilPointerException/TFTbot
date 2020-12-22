"use strict";
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
// @ts-ignore
var screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
var sharp_1 = __importDefault(require("sharp"));
var fs_1 = __importDefault(require("fs"));
/**
 * Service for screenshot and cropping
 */
var ImageService = /** @class */ (function () {
    function ImageService() {
    }
    /**
     * Takes a screenshot and returns the buffer
     */
    ImageService.takeScreenshot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            screenshot_desktop_1.default({ format: 'png' }).then(function (img) {
                                resolve(img);
                            }).catch(function (err) {
                                reject(err);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    ImageService.saveImageBufferToFile = function (imgBuffer, path) {
        fs_1.default.writeFileSync(path, imgBuffer);
    };
    ImageService.saveScreenRectToFile = function (rect, path) {
        ImageService.getScreenRect(rect).then(function (imgBuffer) {
            ImageService.saveImageBufferToFile(imgBuffer, path);
        });
    };
    ImageService.getScreenRect = function (rect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var imgBuffer, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = ImageService).cropImageToBuffer;
                                    return [4 /*yield*/, ImageService.takeScreenshot()];
                                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent(), rect])];
                                case 2:
                                    imgBuffer = _c.sent();
                                    resolve(imgBuffer);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Crops an image buffer
     * @param image
     * @param rect
     */
    ImageService.cropImageToBuffer = function (image, rect) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        sharp_1.default(image).extract({
                            width: rect.width,
                            height: rect.height,
                            left: rect.x,
                            top: rect.y
                        })
                            .toBuffer()
                            .then(function (imageBuffer) {
                            resolve(imageBuffer);
                        })
                            .catch(function (err) {
                            console.log("An error occured: " + err);
                            reject(err);
                        });
                    })];
            });
        });
    };
    /**
     * Takes a screenshot and returns the cropped result as buffer
     * @param rect
     * @returns promise of buffer
     */
    ImageService.getCroppedScreenBuffer = function (rect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var screenshot, imageBuffer;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ImageService.takeScreenshot()];
                                case 1:
                                    screenshot = _a.sent();
                                    return [4 /*yield*/, ImageService.cropImageToBuffer(screenshot, rect)];
                                case 2:
                                    imageBuffer = _a.sent();
                                    resolve(imageBuffer);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return ImageService;
}());
exports.default = ImageService;
