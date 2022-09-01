"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const authentication_1 = require("../middlewares/authentication");
const userRoutes = (0, express_1.Router)();
// Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                state: false,
                message: 'User/Password are invalid'
            });
        }
        if (userDB.comparePassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                state: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                state: false,
                message: 'User/Password are invalid'
            });
        }
    });
});
// Create User
userRoutes.post('/create', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    user_model_1.User.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            state: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            state: false,
            err
        });
    });
});
// Update User
userRoutes.post('/update', authentication_1.verifyToken, (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                state: false,
                message: 'There is no user with that id'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        //res.json({
        //    state: true,
        //    token: tokenUser
        //});
        res.json({
            state: true,
            user: req.user
        });
    });
});
userRoutes.get('/', [authentication_1.verifyToken], (req, res) => {
    const user = req.user;
    res.json({
        state: true,
        user
    });
});
exports.default = userRoutes;
