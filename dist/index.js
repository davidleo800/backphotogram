"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const server_1 = __importDefault(require("./classes/server"));
const user_1 = __importDefault(require("./routes/user"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use((0, express_fileupload_1.default)());
// Application Routes
server.app.use('/user', user_1.default);
server.app.use('/posts', post_1.default);
// DB Connect
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', (err) => {
    if (err)
        throw err;
    console.log('DataBase Online');
});
// Start express
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});
