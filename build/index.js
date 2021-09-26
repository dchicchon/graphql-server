"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const createServer_1 = require("./createServer");
(0, dotenv_1.config)();
const server = (0, createServer_1.createServer)();
server.listen().then(({ url }) => {
    console.log("Server ready at", url);
});
