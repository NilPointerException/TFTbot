"use strict";
exports.__esModule = true;
var Action_1 = require("./Action");
// @ts-ignore
var robotjs_1 = require("robotjs");
var ActionMouseMove_1 = require("./ActionMouseMove");
var ActionMouseClick_1 = require("./ActionMouseClick");
// @ts-ignore
var ghost_cursor_1 = require("ghost-cursor");
var ActionKeyTap_1 = require("./ActionKeyTap");
robotjs_1["default"].setMouseDelay(0);
robotjs_1["default"].setKeyboardDelay(0);
/**
 * Handles the execution of actions
 * Use it to push actions that the service will execute in its own loop
 */
var ActionService = /** @class */ (function () {
    function ActionService() {
    }
    /**
     * Pushes an action at the end of the action stack
     * @param action can be either Action or Array<Action>
     */
    ActionService.push = function (action) {
        var _a;
        if (action instanceof Action_1["default"]) {
            this.actions.push(action);
        }
        else {
            (_a = this.actions).push.apply(_a, action);
        }
    };
    ActionService.actionLoop = function () {
        var action = this.actions.shift();
        if (action) {
            if (action instanceof ActionMouseMove_1["default"]) {
                robotjs_1["default"].moveMouse(action.pos.x, action.pos.y);
            }
            else if (action instanceof ActionMouseClick_1["default"]) {
                robotjs_1["default"].mouseClick();
            }
            else if (action instanceof ActionKeyTap_1["default"]) {
                robotjs_1["default"].keyTap(action.key);
            }
        }
    };
    /**
     * Moves the mouse to the specified position
     * Pushes a human like path of ActionMouseMove into the action stack
     * @param to position as Vector
     */
    ActionService.mouseMove = function (to) {
        var route = ghost_cursor_1["default"].path(robotjs_1["default"].getMousePos(), to);
        this.actions.push(route.map(function (r) { return new ActionMouseMove_1["default"](r); }));
    };
    /**
     * Moves the mouse to the specified position then clicks
     * @param to position as Vector
     */
    ActionService.mouseMoveClick = function (to) {
        this.mouseMove(to);
        this.actions.push(new ActionMouseClick_1["default"]());
    };
    /**
     * Executes a single key tap
     * @param key as a string (e.g. "d" for the letter D)
     */
    ActionService.keyTap = function (key) {
        this.actions.push(new ActionKeyTap_1["default"](key));
    };
    ActionService.actions = [];
    return ActionService;
}());
exports["default"] = ActionService;
// Starts the action loop for the service
setInterval(ActionService.actionLoop, 16);
//# sourceMappingURL=ActionService.js.map