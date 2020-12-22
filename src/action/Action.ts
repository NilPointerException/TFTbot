enum ActionType {
    MOUSE_MOVE,
    MOUSE_LEFT_CLICK,
    MOUSE_LEFT_TOGGLE,
    KEY_TAP,
    CREATE_PATH
}

/**
 * Represents a client action, either mouse mouse/click or keyboard press
 */
export default class Action {
    static ActionType = ActionType; // exposes ActionType enum through Action static class
    type: ActionType | null = null;
}