"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    version: function() {
        return version;
    }
});
var _default = function(parm) {
    var doBadStuff = function() {
        return console.log(window);
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "container d-flex flex-column"
    }, /*#__PURE__*/ React.createElement("b", null, "This kinda works: ", JSON.stringify(parm, null, 2)), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: doBadStuff
    }, "Click me"));
};
var version = 3;


//# sourceMappingURL=test.js.map