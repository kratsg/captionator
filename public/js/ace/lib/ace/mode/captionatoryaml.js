define(function(require, exports, module) {
"use strict";

    var oop = require("../lib/oop");
    var YamlMode = require("./yaml").Mode;
    var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;
    var WorkerClient = require("../worker/worker_client").WorkerClient;

    var Mode = function() {
        this.HighlightRules = YamlHighlightRules;
    };
    oop.inherits(Mode, YamlMode);

    (function() {
        this.createWorker = function(session) {
            var worker = new WorkerClient(["ace"], "ace/mode/captionatoryaml_worker", "Worker");
            worker.attachToDocument(session.getDocument());

            worker.on("annotate", function(results) {
                session.setAnnotations(results.data);
            });

            worker.on("terminate", function() {
                session.clearAnnotations();
            });

            return worker;
        };

        this.$id = "ace/mode/captionatoryaml";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
