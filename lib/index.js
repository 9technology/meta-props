'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _cast = require('./cast');

var _cast2 = _interopRequireDefault(_cast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var splitter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ':';

    var selector = query ? 'meta[name^="' + query + '"]' : 'meta';
    var meta = document.head.querySelectorAll(selector);
    var props = {};

    metaTag: for (var i = 0, len = meta.length; i < len; i++) {
        var base = props;

        var tag = meta.item(i);
        var name = tag.getAttribute('name');
        var type = tag.getAttribute('type');
        var key = query ? name.substring(query.length) : name;
        var value = (0, _cast2.default)(tag.getAttribute('content'), type);
        var split = key.split(splitter).filter(Boolean).map(function (k) {
            return (0, _camelcase2.default)(k);
        });
        var splitLen = split.length;

        // singular value
        if (!splitLen) {
            // single array value
            if (len > 1) {
                if (!Array.isArray(props)) props = [];
                props.push(value);
            } else {
                props = value;
                break;
            }
        }

        var lastIndex = splitLen - 1;
        for (var j = 0; j < splitLen; j++) {
            var path = split[j];

            // last split, assign
            if (j === lastIndex) {
                var val = base[path];
                // set
                if (typeof val === 'undefined') {
                    base[path] = value;
                } else {
                    // already set, convert multiples to array
                    if (!Array.isArray(val)) {
                        val = base[path] = [val];
                    }
                    val.push(value); // we looped from the end
                }
                continue;
            }

            // set next path
            base[path] = base[path] || {};
            base = base[path];

            if ((typeof base === 'undefined' ? 'undefined' : _typeof(base)) !== 'object') {
                console.warn('Meta Props: Skipping `' + name + '`, type mismatch, key exists as a (' + (typeof base === 'undefined' ? 'undefined' : _typeof(base)) + ').');
                continue metaTag;
            }
        }
    }

    return props;
};