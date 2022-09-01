"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    SaveTemporaryImage(file, userId) {
        return new Promise((resolve, reject) => {
            // create folders
            const path = this.CreateUserFolder(userId);
            // file name
            const fileName = this.generateUniqueName(file.name);
            // Move file temp to folder dist/uploads
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    // not ok
                    reject(err);
                }
                else {
                    // its ok
                    resolve();
                }
            });
        });
    }
    generateUniqueName(originalName) {
        //name.jpg
        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];
        const uniqId = (0, uniqid_1.default)();
        return `${uniqId}.${extension}`;
    }
    CreateUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagesFromTemptoPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesTemp(userId);
        imagesTemp.forEach(image => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;
    }
    getImagesTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getPhotoUrl(userId, img) {
        // Path POSTs
        const pathPhoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const exist = fs_1.default.existsSync(pathPhoto);
        if (!exist) {
            return path_1.default.resolve(__dirname, '../../assets/400x250.jpg');
        }
        return pathPhoto;
    }
}
exports.default = FileSystem;
