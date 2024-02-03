"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
fs.readFile("윤지수/chapter-8/2.콜백_사용하기/text.txt", { encoding: "utf8" }, function (error, data) {
    if (error) {
        console.error("error reading!", error);
        return;
    }
    console.info("success reading!", data);
});
fs.appendFile("윤지수/chapter-8/2.콜백_사용하기/text.txt", "New access log entry", function (error) {
    if (error) {
        console.error("error writing!", error);
    }
});
