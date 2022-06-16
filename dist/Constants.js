"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVATARS = exports.DRAW_IMAGE = exports.RECORD_TYPE = exports.SHARE_OPTIONS = exports.TIME_EMOTION_STATUS_RESET = exports.EMOTIONS = exports.BLOG_TYPES = exports.SELECTED = exports.BAN = exports.FRIEND_SPECIFIC = exports.DRAFT = exports.FRIEND = exports.PUBLIC = exports.PRIVATE = exports.ROLES = exports.FIREBASE_CONFIG = void 0;
exports.FIREBASE_CONFIG = {
    apiKey: "AIzaSyAAs6kCWVS_uuHFXuTEQ-3hqjOdAnZQjxE",
    authDomain: "spremo-e2a0f.firebaseapp.com",
    projectId: "spremo-e2a0f",
    storageBucket: "spremo-e2a0f.appspot.com",
    messagingSenderId: "204268237203",
    appId: "1:204268237203:web:e1121553bc3b44b41eb866",
    measurementId: "G-49J9HYZTMJ"
};
exports.ROLES = {
    GUEST: 0,
    USER: 1,
    ADMIN: 2,
    DEVELOPER: 3,
    CENSOR: 4
};
exports.PRIVATE = 1;
exports.PUBLIC = 2;
exports.FRIEND = 3;
exports.DRAFT = 4;
exports.FRIEND_SPECIFIC = 5;
exports.BAN = 6;
exports.SELECTED = 1;
exports.BLOG_TYPES = {
    AUDIO: 1,
    IMAGE: 2,
    VIDEO: 3,
    COMBINE: 4,
    DRAW: 5
};
exports.EMOTIONS = [
    { id: 0, name: "unknown" },
    { id: 1, name: "happy" },
    { id: 2, name: "sad" },
    { id: 3, name: "angry" },
    { id: 4, name: "ok" },
    { id: 5, name: "good" },
];
exports.TIME_EMOTION_STATUS_RESET = 1 * 60 * 60;
exports.SHARE_OPTIONS = [
    { id: exports.PUBLIC, title: "Share to everyone" },
    { id: exports.FRIEND, title: "Share to friend" },
    { id: exports.FRIEND_SPECIFIC, title: "Share to friend specific" }
];
exports.RECORD_TYPE = {
    COMMENT: 1,
    LIKE: 2,
    VIEW: 3,
    BLOG: 4,
    FOLLOW: 5
};
exports.DRAW_IMAGE = "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652014490/spremo_draw_elktsy.jpg";
exports.AVATARS = [
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015025/emotion/smile_xmtbsx.jpg",
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015025/emotion/yummy_bzrzpx.png",
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015026/emotion/start_whe6yj.jpg",
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015027/emotion/funny_ha5jak.jpg"
];
//# sourceMappingURL=Constants.js.map