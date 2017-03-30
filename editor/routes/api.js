var express = require("express"),
    fs = require("fs"),
    globby = require("globby"),
    matter = require("gray-matter");

var router = express.Router();

router.get("/content", function (req, res) {
    var contents = [];
    globby(["src/content/**/*.md"]).then(function (paths) {
        paths.forEach(function (filePath) {
            var fileContent = fs.readFileSync(filePath, {
                encoding: "utf8"
            });
            var fileJson = matter(fileContent);
            contents.push({
                data: fileJson["data"],
                content: fileJson["content"],
                file: filePath
            });
        });
        res.json(contents);
    });
});

router.post("/content", function (req, res) {
    var content = matter.stringify(req.body.content, res.body.data);
    fs.writeFile(req.body.file, content, function (err) {
        if (err) {
            res.status(500);
        }
        res.status(204);
    });
});

module.exports = router;