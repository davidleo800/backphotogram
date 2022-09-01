"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
// Get Post paginated
postRoutes.get('/', [authentication_1.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        state: true,
        page,
        posts
    });
}));
// Create Post
postRoutes.post('/', [authentication_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const images = fileSystem.imagesFromTemptoPost(req.user._id);
    body.imgs = images;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('user', '-password');
        res.json({
            state: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Service to file upload
postRoutes.post('/upload', [authentication_1.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            state: false,
            message: 'No file uploaded'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            state: false,
            message: 'No image file uploaded, bad request'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            state: false,
            message: 'Uploaded file is not an image'
        });
    }
    yield fileSystem.SaveTemporaryImage(file, req.user._id);
    res.json({
        state: true,
        message: 'file uploaded',
        file: file.mimetype
    });
}));
postRoutes.get('/image/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathPhoto = fileSystem.getPhotoUrl(userId, img);
    res.sendFile(pathPhoto, img);
});
exports.default = postRoutes;
