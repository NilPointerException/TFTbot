"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionType;
(function (ActionType) {
    ActionType[ActionType["MOUSE_MOVE"] = 0] = "MOUSE_MOVE";
    ActionType[ActionType["MOUSE_LEFT_CLICK"] = 1] = "MOUSE_LEFT_CLICK";
    ActionType[ActionType["MOUSE_LEFT_TOGGLE"] = 2] = "MOUSE_LEFT_TOGGLE";
    ActionType[ActionType["KEY_TAP"] = 3] = "KEY_TAP";
    ActionType[ActionType["CREATE_PATH"] = 4] = "CREATE_PATH";
})(ActionType || (ActionType = {}));
/**
 * Represents a client action, either mouse mouse/click or keyboard press
 */
var Action = /** @class */ (function () {
    function Action() {
        this.type = null;
    }
    Action.ActionType = ActionType; // exposes ActionType enum through Action static class
    return Action;
}());
exports.default = Action;
