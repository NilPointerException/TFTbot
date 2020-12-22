import Action from "./Action";
import * as robot from "robotjs";
import ActionMouseMove from "./ActionMouseMove";
import ActionMouseClick from "./ActionMouseClick";
import * as ghostCursor from "ghost-cursor";
import Vector from "../Vector";
import ActionKeyTap from "./ActionKeyTap";
import ActionMouseCreatePath from "./ActionMouseCreatePath";

robot.setMouseDelay(0);
robot.setKeyboardDelay(0);
/**
 * Handles the execution of actions
 * Use it to push actions that the service will execute in its own loop
 */
export default class ActionService {
    static actions: any[] = [];
    static lastPosition: Vector = robot.getMousePos();

    /**
     * Pushes an action at the end of the action stack
     * @param action can be either Action or Array<Action>
     */
    static push(action: any): void {
        if (action.length === undefined) {
            ActionService.actions.push(action);
        } else {
            ActionService.actions.push(...action);
        }
    }

    static actionLoop(): void {
        const action = ActionService.actions.shift();
        if (!!action) {
            if (Action.ActionType.MOUSE_MOVE === action.type) {
                robot.moveMouse(action.pos.x, action.pos.y);
                ActionService.lastPosition = action.pos;
            } else if (Action.ActionType.MOUSE_LEFT_CLICK === action.type) {
                robot.mouseClick();
            }else if (Action.ActionType.MOUSE_LEFT_TOGGLE === action.type) {
                robot.mouseToggle();
            } else if (Action.ActionType.KEY_TAP === action.type) {
                robot.keyTap(action.key);
            } else if (Action.ActionType.CREATE_PATH === action.type) {
                const route = ghostCursor.path(robot.getMousePos(), action.pos);
                const acts: ActionMouseMove[] = route.map((r: Vector) =>
                    new ActionMouseMove(r)
                );
                ActionService.actions.unshift(...acts);
            }
        }
    }

    /**
     * Moves the mouse to the specified position
     * Pushes a human like path of ActionMouseMove into the action stack
     * @param to position as Vector
     */
    static mouseMove(to: Vector) {
        ActionService.push(new ActionMouseCreatePath(to));
    }

    /**
     * Moves the mouse to the specified position then clicks
     * @param to position as Vector
     */
    static mouseMoveClick(to: Vector) {
        ActionService.mouseMove(to);
        ActionService.push(new ActionMouseClick());
    }

    /**
     * Executes a single key tap
     * @param key as a string (e.g. "d" for the letter D)
     */
    static keyTap(key: string) {
        ActionService.push(new ActionKeyTap(key));
    }
}

// Starts the action loop for the service
setInterval(ActionService.actionLoop, 10);