"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadFields = exports.fileUploadAvatar = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fileUploadAvatar = (fieldName /* tên trường file */, dir = 'images' /* thư mục lưu trữ */) => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: 'public/' + dir, // cấu hình nới lưu trữ file với thư mục public và dir là thư mục con
            filename: (req, file, cb) => {
                const extension = path_1.default.extname(file.originalname); // lấy phần mở rộng của file
                cb(null, (0, uuid_1.v4)() + extension); // tạo tên file duy nhất bằng cách sử dụng uuid
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 20 //20MB - giới hạn kích thước file
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg' // kiểm tra loại file
            ) {
                cb(null, true); // cho phép file nếu loại hợp lệ
            }
            else {
                cb(new Error('Only JPEG and PNG images are allowed.'), false);
            }
        }
    }).single(fieldName); // sử dụng single để upload một file duy nhất
};
exports.fileUploadAvatar = fileUploadAvatar;
const FileUploadFields = (fields, dir) => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                if (file.fieldname === 'image') {
                    cb(null, 'public/images/products');
                }
                else if (file.fieldname === 'images') {
                    cb(null, 'public/images/products/ImagesProductMore');
                }
                else if (dir) {
                    cb(null, 'public/' + dir);
                }
                else {
                    cb(null, 'public/images');
                }
            },
            filename: (req, file, cb) => {
                const extension = path_1.default.extname(file.originalname);
                cb(null, (0, uuid_1.v4)() + extension);
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 20 //10MB - giới hạn kích thước file
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg') {
                cb(null, true);
            }
            else {
                cb(new Error('Only JPEG and PNG images are allowed.'), false);
            }
        }
    }).fields(fields);
};
exports.FileUploadFields = FileUploadFields;
//# sourceMappingURL=multer.middleware.js.map