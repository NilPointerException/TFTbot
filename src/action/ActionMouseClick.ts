import Action from "./Action";

/**
 * Represents a client mouse left click
 */
export default class ActionMouseClick extends Action {
    type = Action.ActionType.MOUSE_LEFT_CLICK;
}