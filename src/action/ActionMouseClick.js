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
exports.__esModule = true;
var Action_1 = require("./Action");
/**
 * Represents a client mouse left click
 */
var ActionMouseClick = /** @class */ (function (_super) {
    __extends(ActionMouseClick, _super);
    function ActionMouseClick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = Action_1["default"].ActionType.MOUSE_LEFT_CLICK;
        return _this;
    }
    return ActionMouseClick;
}(Action_1["default"]));
exports["default"] = ActionMouseClick;
//# sourceMappingURL=ActionMouseClick.js.map