var express = require("express"),
    fs = require("fs"),
    globby = require("globby"),
    parser = require("parser-front-matter");

var router = express.Router();

router.get("/content", function (req, res) {
    var contents = [];
    globby(["../../"]).then(function(paths) {
        paths.forEach(function(filePath) {
            var fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
            var fileJson = parser.parseSync(fileContent);
            contents.push(fileJson);
        });
        res.json(contents);
    });
});

module.exports = router;