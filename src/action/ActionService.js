"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __importDefault(require("./Action"));
var robot = __importStar(require("robotjs"));
var ActionMouseMove_1 = __importDefault(require("./ActionMouseMove"));
var ActionMouseClick_1 = __importDefault(require("./ActionMouseClick"));
var ghostCursor = __importStar(require("ghost-cursor"));
var ActionKeyTap_1 = __importDefault(require("./ActionKeyTap"));
var ActionMouseCreatePath_1 = __importDefault(require("./ActionMouseCreatePath"));
robot.setMouseDelay(0);
robot.setKeyboardDelay(0);
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
        if (action.length === undefined) {
            ActionService.actions.push(action);
        }
        else {
            (_a = ActionService.actions).push.apply(_a, action);
        }
    };
    ActionService.actionLoop = function () {
        var _a;
        var action = ActionService.actions.shift();
        if (!!action) {
            if (Action_1.default.ActionType.MOUSE_MOVE === action.type) {
                robot.moveMouse(action.pos.x, action.pos.y);
                ActionService.lastPosition = action.pos;
            }
            else if (Action_1.default.ActionType.MOUSE_LEFT_CLICK === action.type) {
                robot.mouseClick();
            }
            else if (Action_1.default.ActionType.MOUSE_LEFT_TOGGLE === action.type) {
                robot.mouseToggle();
            }
            else if (Action_1.default.ActionType.KEY_TAP === action.type) {
                robot.keyTap(action.key);
            }
            else if (Action_1.default.ActionType.CREATE_PATH === action.type) {
                var route = ghostCursor.path(robot.getMousePos(), action.pos);
                var acts = route.map(function (r) {
                    return new ActionMouseMove_1.default(r);
                });
                (_a = ActionService.actions).unshift.apply(_a, acts);
            }
        }
    };
    /**
     * Moves the mouse to the specified position
     * Pushes a human like path of ActionMouseMove into the action stack
     * @param to position as Vector
     */
    ActionService.mouseMove = function (to) {
        ActionService.push(new ActionMouseCreatePath_1.default(to));
    };
    /**
     * Moves the mouse to the specified position then clicks
     * @param to position as Vector
     */
    ActionService.mouseMoveClick = function (to) {
        ActionService.mouseMove(to);
        ActionService.push(new ActionMouseClick_1.default());
    };
    /**
     * Executes a single key tap
     * @param key as a string (e.g. "d" for the letter D)
     */
    ActionService.keyTap = function (key) {
        ActionService.push(new ActionKeyTap_1.default(key));
    };
    ActionService.actions = [];
    ActionService.lastPosition = robot.getMousePos();
    return ActionService;
}());
exports.default = ActionService;
// Starts the action loop for the service
setInterval(ActionService.actionLoop, 10);
