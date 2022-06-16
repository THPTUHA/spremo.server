"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebase_db = void 0;
/// <reference lib="dom" />
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app_1 = require("firebase/app");
const serviceAccountKey_json_1 = __importDefault(require("./serviceAccountKey.json"));
const serviceAccountKey_product_json_1 = __importDefault(require("./serviceAccountKey.product.json"));
const Constants_1 = require("../../Constants");
(0, app_1.initializeApp)(Constants_1.FIREBASE_CONFIG);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(process.env.NODE_ENV !== "production" ? serviceAccountKey_json_1.default : serviceAccountKey_product_json_1.default)
});
firebase_admin_1.default.firestore().settings({ ignoreUndefinedProperties: true });
exports.firebase_db = firebase_admin_1.default.firestore();
//# sourceMappingURL=firebase.js.map