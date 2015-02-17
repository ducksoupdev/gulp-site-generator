/* Simple install script for the gulp site generator */

var fs = require('fs');

var options = { path: './' };
var args = process.argv.slice(2);
if (args.length === 2 && args[0] === '--path') {
    options.path = args[1];
}

var fileOptions = {encoding: 'utf8'};
var files = ['gulpfile.js', 'package.json', 'site.json'];

files.forEach(function (file) {
    fs.readFile(file, fileOptions, function (contents) {
        fs.writeFile(options.path + file, contents, fileOptions);
    });
});
