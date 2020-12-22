import Vector from "../Vector";
import Action from "./Action";

/**
 * Represents a client mouse movement
 */
export default class ActionMouseCreatePath extends Action {
    type = Action.ActionType.CREATE_PATH;
    pos: Vector;

    constructor(pos: Vector) {
        super();
        this.pos = pos;
    }
}