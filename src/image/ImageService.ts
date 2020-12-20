import screenshot from "screenshot-desktop";
// @ts-ignore
import sharp from "sharp";
import Rect from "../Rect";

/**
 * Service for screenshot and cropping
 */
export default class ImageService {
    /**
     * Takes a screenshot and returns the buffer
     */
    static async takeScreenshot(): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            screenshot({format: 'png'}).then((img: Buffer) => {
                resolve(img);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    /**
     * Crops an image buffer
     * @param image
     * @param rect
     */
    static async cropImageToBuffer(image: Buffer, rect: Rect): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            console.log(rect.width, rect.height, rect.x, rect.y);
            sharp(image).extract({
                width: rect.width,
                height: rect.height,
                left: rect.x,
                top: rect.y
            })
                .toBuffer()
                .then((imageBuffer: Buffer) => {
                    resolve(imageBuffer);
                    console.log("Image cropped");
                })
                .catch((err: Error) => {
                    console.log("An error occured: " + err);
                    reject(err);
                });
        })
    }

    /**
     * Takes a screenshot and returns the cropped result as buffer
     * @param rect
     * @returns promise of buffer
     */
    static async getCroppedScreenBuffer(rect: Rect): Promise<Buffer> {
        return new Promise(async (resolve) => {
            let screenshot = await ImageService.takeScreenshot();
            let imageBuffer = await ImageService.cropImageToBuffer(screenshot, rect);

            resolve(imageBuffer);
        });
    }


}