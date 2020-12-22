import Action from "./Action";

/**
 * Represents a client mouse left click
 */
export default class ActionMouseToggle extends Action {
    type = Action.ActionType.MOUSE_LEFT_TOGGLE;
}