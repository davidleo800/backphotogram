"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    message: {
        type: String
    },
    imgs: [{
            type: String
        }],
    coords: {
        type: String
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: 'There must be a reference to a user'
    }
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = (0, mongoose_1.model)('Post', postSchema);
