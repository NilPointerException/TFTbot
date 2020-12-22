// @ts-ignore
import screenshot from "screenshot-desktop";
import sharp from "sharp";
import Rect from "../Rect";
import fs from "fs";

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
            }).catch((err: any) => {
                reject(err);
            })
        });
    }

    static saveImageBufferToFile(imgBuffer: Buffer, path: string): void {
        fs.writeFileSync(path, imgBuffer);
    }

    static saveScreenRectToFile(rect: Rect, path: string): void {
        ImageService.getScreenRect(rect).then((imgBuffer: Buffer) => {
            ImageService.saveImageBufferToFile(imgBuffer, path);
        });
    }

    static async getScreenRect(rect: Rect): Promise<Buffer> {
        return new Promise(async (resolve) => {
            const imgBuffer: Buffer = await ImageService.cropImageToBuffer(await ImageService.takeScreenshot(), rect);
            resolve(imgBuffer);
        });
    }

    /**
     * Crops an image buffer
     * @param image
     * @param rect
     */
    static async cropImageToBuffer(image: Buffer, rect: Rect): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            sharp(image).extract({
                width: rect.width,
                height: rect.height,
                left: rect.x,
                top: rect.y
            })
                .toBuffer()
                .then((imageBuffer: Buffer) => {
                    resolve(imageBuffer);
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