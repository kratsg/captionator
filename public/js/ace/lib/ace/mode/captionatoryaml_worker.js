importScripts('/js/ajv.min.js', '/js/yaml.min.js');

define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var lang = require("../lib/lang");
    var Mirror = require("../worker/mirror").Mirror;

    var errorTypes = {
        "expected-doctype-but-got-start-tag": "info",
        "expected-doctype-but-got-chars": "info",
        "non-html-root": "info"
    }

    var Worker = exports.Worker = function(sender) {
        Mirror.call(this, sender);
        this.setTimeout(500);
        this.setOptions();
    };

    oop.inherits(Worker, Mirror);

    (function() {

        this.setOptions = function(options) {
            this.options = options || {};
            this.doc.getValue() && this.deferredUpdate.schedule(100);
        };

        this.changeOptions = function(newOptions) {
            oop.mixin(this.options, newOptions);
            this.doc.getValue() && this.deferredUpdate.schedule(100);
        };

        this.isValidYAML = function(str) {
            console.log('isValidYAML');
            var parsed = '';
            try {
                parsed = YAML.parse(str);
            } catch(e) {
                console.log(JSON.stringify(e));
                console.log(e.message);
                return {parsed: parsed, result: false};
            }
            return {parsed: parsed, result: true};
        };

        this.onUpdate = function() {
            var value = this.doc.getValue();
            value = value.replace(/#.*\n/, "\n");
            if (!value)
                return this.sender.emit("annotate", []);

            var parseYAML = this.isValidYAML(value);
            console.log(parseYAML);
            //var results =

            var errors = [];
            /*
            errors.push({
                row: location.line,
                column: location.column,
                text: message,
                type: errorTypes[code] || "error",
                raw: raw
            });
            */
            this.sender.emit("error", errors);
        };

    }).call(Worker.prototype);

});
