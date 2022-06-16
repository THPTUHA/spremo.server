export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAAs6kCWVS_uuHFXuTEQ-3hqjOdAnZQjxE",
    authDomain: "spremo-e2a0f.firebaseapp.com",
    projectId: "spremo-e2a0f",
    storageBucket: "spremo-e2a0f.appspot.com",
    messagingSenderId: "204268237203",
    appId: "1:204268237203:web:e1121553bc3b44b41eb866",
    measurementId: "G-49J9HYZTMJ"
}

export const ROLES = {
    GUEST: 0,
    USER: 1,
    ADMIN: 2,
    DEVELOPER: 3,
    CENSOR: 4
}

export const PRIVATE = 1;
export const PUBLIC = 2;
export const FRIEND = 3;
export const DRAFT = 4;
export const FRIEND_SPECIFIC = 5;
export const BAN = 6;

export const SELECTED = 1;
export const BLOG_TYPES = {
    AUDIO: 1,
    IMAGE: 2,
    VIDEO: 3,
    COMBINE: 4,
    DRAW: 5,
    MUSIC: 6,
    NOTE: 7
}

export const EMOTIONS = [
    {id: 0, name:"unknown"},
    {id: 1, name:"happy"},
    {id: 2, name:"sad"},
    {id: 3, name:"angry"},
    {id: 4, name:"ok"},
    {id: 5, name:"good"},
]

export const TIME_EMOTION_STATUS_RESET = 1 * 60 * 60;

export const SHARE_OPTIONS = [
    {id: PUBLIC, title:"Share to everyone"},
    {id: FRIEND, title:"Share to friend"},
    {id: FRIEND_SPECIFIC, title:"Share to friend specific"}
]

export const RECORD_TYPE= {
    COMMENT: 1,
    LIKE: 2,
    VIEW : 3,
    BLOG: 4,
    FOLLOW: 5
}

export const DRAW_IMAGE = "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652014490/spremo_draw_elktsy.jpg";
export const AVATARS = [
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015025/emotion/smile_xmtbsx.jpg",
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015025/emotion/yummy_bzrzpx.png",
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015026/emotion/start_whe6yj.jpg",
    "https://res.cloudinary.com/nghiawebgamejava/image/upload/v1652015027/emotion/funny_ha5jak.jpg"
]

export const SETTINGS = [
    {action: "listen_music", type: ["select", "random"],},
    {action: "read_blog", type: ["select", "random"]},
    {action: "reminder", type: ["select", "random"]},
]