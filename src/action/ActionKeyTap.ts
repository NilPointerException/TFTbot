import Vector from "../Vector";
import Action from "./Action";

/**
 * Represents a client mouse movement
 */
export default class ActionKeyTap extends Action {
    type = Action.ActionType.KEY_TAP;
    key: string;

    constructor(key: string) {
        super();
        this.key = key;
    }
}