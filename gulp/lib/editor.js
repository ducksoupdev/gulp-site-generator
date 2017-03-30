"use strict";

var gulp = require("gulp"),
    open = require("gulp-open"),
    app = require("../../editor"),
    siteJson = require("../../site"),
    debug = require("debug")("express-sample:server"),
    http = require("http");

module.exports.start = function (callback) {
    var port = siteJson.editor.port || 8080;

    app.set("port", port);

    var server = http.createServer(app);

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);

    // open the browser
    gulp.src(__filename).pipe(open({uri: "http://localhost:8080"}));

    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        var bind = typeof port === "string" ?
            "Pipe " + port :
            "Port " + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === "string" ?
            "pipe " + addr :
            "port " + addr.port;
        debug("Listening on " + bind);
    }
};