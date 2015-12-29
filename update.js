/* global process, __dirname */
"use strict";

/*
 Simple update script for the gulp site generator

 * Updates the package.json file in the project root
 * Copies any missing or new install files

 */

var fs = require("fs"),
    path = require("path"),
    jsonFile = require("./install/lib/json-file"),
    versionCompare = require("./install/lib/version-compare");

var rootPath = process.cwd(),
    rootPathName = path.basename(__dirname),
    filesInstalled = 0,
    directoriesCreated = 0;
    
// install missing files
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

if (directoriesCreated || filesInstalled) {
    console.info("%d %s created and %d %s installed!", 
        directoriesCreated, 
        (directoriesCreated === 1 ? "directory": "directories"), 
        filesInstalled,
        (filesInstalled === 1 ? "file" : "files"));
}

// update package.json file
if (fs.existsSync(rootPath + "/package.json")) {
    var updatedModules = [], packages, newPackages;
    var packagesContent = fs.readFileSync(rootPath + "/package.json", { encoding: "utf8" });
    var newPackageContents = fs.readFileSync(__dirname + "/package.json", { encoding: "utf8" });
    
    try {
        packages = JSON.parse(packagesContent);
        newPackages = JSON.parse(newPackageContents);
    } catch (err) {
        throw err;
    }
    
    var packagesToUpdate = newPackages.dependencies;
    
    // compare each version and only update where the version to be installed is greater than the installed one
    if (Object.keys(packagesToUpdate).length > 0) {
        for (var moduleName in packagesToUpdate) {
            if (packagesToUpdate.hasOwnProperty(moduleName)) {
                var newModuleVersion = packagesToUpdate[moduleName];
                if (!packages.devDependencies.hasOwnProperty(moduleName) ||
                    versionCompare(packages.devDependencies[moduleName], newModuleVersion) < 0) {
                    var oldModuleVersion = packages.devDependencies[moduleName];
                    packages.devDependencies[moduleName] = newModuleVersion;
                    updatedModules.push({
                        name: moduleName,
                        newVersion: newModuleVersion,
                        oldVersion: oldModuleVersion
                    });
                }
            }
        }
    }

    // write out the new package.json
    jsonFile.writeJsonFile(rootPath + "/package.json", packages, {
        spaces: 4,
        encoding: "utf8"
    });
    
    var updatedModuleCount = Object.keys(updatedModules).length;

    if (updatedModuleCount) {
        console.info("%d %s updated in package.json!", 
            updatedModuleCount, 
            (updatedModuleCount === 1 ? "module" : "modules"));
        console.info("Run 'npm install'");
    }
}

