/* global process, __dirname */
"use strict";

/*
 Simple install script for the gulp site generator

 * Copies the gulpfile.js, package.json and site.json files to the project root
 * Creates an src directory
 * Creates the following directories: src/content, src/templates, src/sass, src/content, src/content/pages src/content/posts
 * Creates the following files: src/content/*.md, src/templates/*.hbs, src/sass/*.scss, src/images/*.jpg
 
 */

var fs = require("fs"),
    path = require("path"),
    jsonFile = require("./install/lib/json-file");
    
function extend(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            destination[property] = extend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

var rootPath = process.cwd(),
    rootPathName = path.basename(__dirname),
    filesInstalled = 0,
    directoriesCreated = 0;

var fileIndex = fs.readFileSync(__dirname + "/install/files.json", { encoding: "utf8" });
var fileList = JSON.parse(fileIndex);

if (!fs.existsSync(rootPath + "/src")) {
    fs.mkdirSync(rootPath + "/src");
    directoriesCreated++;
}

fileList.files.forEach(function (file) {
    var contents = null, isRootFile = file.file.indexOf("/") === -1;
    
    var filePath = (isRootFile ? rootPath + "/" + file.file : rootPath + "/src/" + file.file); 
    
    if (!fs.existsSync(filePath)) {
        if (!isRootFile) {
            // create the directory if required
            var dir = path.dirname(file.file), dirPath = path.join(rootPath + "/src/" + dir);
            
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                directoriesCreated++;
            }
            
            contents = fs.readFileSync(__dirname + "/install/" + file.file, file.encoding);
            fs.writeFileSync(filePath, contents, { encoding: file.encoding });
            filesInstalled++;
            
        } else {
            contents = fs.readFileSync(__dirname + "/" + file.file, file.encoding);

            // replace the path to the gulp tasks
            if (file.file === "gulpfile.js") {
                contents = contents.replace(/\.\/gulp\/tasks/, "./" + rootPathName + "/gulp/tasks/");
            }

            fs.writeFileSync(filePath, contents, { encoding: file.encoding });
            filesInstalled++;
        }
    }
});

// package.json changes
var packages = null, 
    packagesContent = fs.readFileSync(rootPath + "/package.json", { encoding: "utf8" });

try {
    packages = JSON.parse(packagesContent);
    
    // cleanup package.json
    var dependencies = packages.dependencies;
    packages.devDependencies = {};
    extend(packages.devDependencies, dependencies);
    
    delete packages.dependencies;
    delete packages.keywords;
    delete packages.scripts;
    packages.version = "0.1.0";
    packages.name = "";
    packages.description = "";
    packages.author = "";
    
    // write out the new package.json
    jsonFile.writeJsonFile(rootPath + "/package.json", packages, {
        spaces: 4,
        encoding: "utf8"
    });
} catch (err) {
    console.error(err);
}

console.info("%d %s created and %d %s installed!", 
        directoriesCreated, 
        (directoriesCreated === 1 ? "directory": "directories"), 
        filesInstalled,
        (filesInstalled === 1 ? "file" : "files"));
        
if (directoriesCreated && filesInstalled) {
    console.info("Run 'npm install' then 'gulp' to get started");
}