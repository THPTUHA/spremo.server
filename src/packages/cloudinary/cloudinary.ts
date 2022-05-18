import cloudinary from 'cloudinary'
const cloudinary_handle = cloudinary.v2;
cloudinary_handle.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary_handle;