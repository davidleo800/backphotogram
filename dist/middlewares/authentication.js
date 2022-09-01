"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
const verifyToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.checkToken(userToken)
        .then((decode) => {
        console.log('Decode', decode);
        req.user = decode.user;
        next();
    }).catch(err => {
        res.json({
            state: false,
            message: 'Invalid Token'
        });
    });
};
exports.verifyToken = verifyToken;
