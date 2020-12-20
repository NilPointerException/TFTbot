import Vector from "../Vector";
import Action from "./Action";

/**
 * Represents a client mouse movement
 */
export default class ActionMouseMove extends Action {
    type = Action.ActionType.MOUSE_MOVE;
    pos: Vector;

    constructor(pos: Vector) {
        super();
        this.pos = pos;
    }
}