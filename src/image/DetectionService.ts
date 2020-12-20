import ImageService from "./ImageService";
import vision from "@google-cloud/vision";
import Vector from "../Vector";
import Rect from "../Rect";

const client = new vision.ImageAnnotatorClient();

/**
 * Service for image detection
 */
export default class DetectionService {
    /**
     * Returns a list of positions where the input word was found
     * @param word the word you search
     * @param rect Rect of scanned zone on the screen
     * @returns Promise of Vector list, can be empty
     */
    static async getPositionsOfWordInRect(word: string = "guerre", rect: Rect): Promise<Vector[]> {
        return new Promise(async (resolve) => {
            const imgBuffer = await ImageService.getCroppedScreenBuffer(rect);

            // Performs text detection on the local file
            const [result] = await client.textDetection(imgBuffer);
            const detections = result.textAnnotations;
            const warlordsPositions = [];

            detections.forEach(text => {
                if (text.description.toLowerCase().search(word) !== -1) {
                    warlordsPositions.push({
                        x: text.boundingPoly.vertices[0].x + rect.x,
                        y: text.boundingPoly.vertices[0].y + rect.y
                    });
                }
            });

            resolve(warlordsPositions);
        })
    }
}