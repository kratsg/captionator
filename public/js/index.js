var validator = require('jsonschema').validate;
var yaml = require('js-yaml');
var schema = require('./schema/play.json');

module.exports = function(blob){
    var parsedYaml = yaml.safeLoad(blob);
    return validate(yaml.safeLoad(blob), schema);
};
