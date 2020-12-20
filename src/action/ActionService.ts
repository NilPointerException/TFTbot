import Action from "./Action";
// @ts-ignore
import robot from "robotjs";
import ActionMouseMove from "./ActionMouseMove";
import ActionMouseClick from "./ActionMouseClick";
// @ts-ignore
import ghostCursor from "ghost-cursor";
import Vector from "../Vector";
import ActionKeyTap from "./ActionKeyTap";

robot.setMouseDelay(0);
robot.setKeyboardDelay(0);
/**
 * Handles the execution of actions
 * Use it to push actions that the service will execute in its own loop
 */
export default class ActionService {
    static actions: Action[] = [];

    /**
     * Pushes an action at the end of the action stack
     * @param action can be either Action or Array<Action>
     */
    static push(action: Action | Action[]): void {
        if (action instanceof Action) {
            this.actions.push(action);
        } else {
            this.actions.push(...action);
        }
    }

    static actionLoop(): void {
        const action = this.actions.shift();
        if (action) {
            if (action instanceof ActionMouseMove) {
                robot.moveMouse(action.pos.x, action.pos.y);
            } else if (action instanceof ActionMouseClick) {
                robot.mouseClick();
            }else if(action instanceof ActionKeyTap){
                robot.keyTap(action.key);
            }
        }
    }

    /**
     * Moves the mouse to the specified position
     * Pushes a human like path of ActionMouseMove into the action stack
     * @param to position as Vector
     */
    static mouseMove(to: Vector) {
        const route = ghostCursor.path(robot.getMousePos(), to);
        this.actions.push(route.map((r) => new ActionMouseMove(r)));
    }

    /**
     * Moves the mouse to the specified position then clicks
     * @param to position as Vector
     */
    static mouseMoveClick(to: Vector) {
        this.mouseMove(to);
        this.actions.push(new ActionMouseClick());
    }

    /**
     * Executes a single key tap
     * @param key as a string (e.g. "d" for the letter D)
     */
    static keyTap(key: string){
        this.actions.push(new ActionKeyTap(key));
    }
}

// Starts the action loop for the service
setInterval(ActionService.actionLoop, 16);