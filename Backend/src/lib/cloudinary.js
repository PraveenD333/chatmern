import {v2 as cloudinary} from 'cloudinary'
config()
import { config } from 'dotenv'

cloudinary.config({
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINAR_API_KEY,
    api_secret: process.env.CLOUDINAR_API_SECRET,
});

export default cloudinary;