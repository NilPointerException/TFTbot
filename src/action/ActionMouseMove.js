"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __importDefault(require("./Action"));
/**
 * Represents a client mouse movement
 */
var ActionMouseMove = /** @class */ (function (_super) {
    __extends(ActionMouseMove, _super);
    function ActionMouseMove(pos) {
        var _this = _super.call(this) || this;
        _this.type = Action_1.default.ActionType.MOUSE_MOVE;
        _this.pos = pos;
        return _this;
    }
    return ActionMouseMove;
}(Action_1.default));
exports.default = ActionMouseMove;
