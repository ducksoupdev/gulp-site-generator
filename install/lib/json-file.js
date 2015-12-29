var fs = require("fs");

module.exports.writeJsonFile = function(file, obj, options) {
    options = options || {};

    var spaces = typeof options === "object" && options !== null ? "spaces" in options ? options.spaces : this.spaces : this.spaces;

    var str = JSON.stringify(obj, options.replacer, spaces) + "\n";
    
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options);
};