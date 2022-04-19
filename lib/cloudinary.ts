
import {v2 as cloudinary} from 'cloudinary'
import {Cloudinary} from "@cloudinary/url-gen";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});



export const cld = new Cloudinary({
  cloud: {
        cloudName:'codewithwhyte',
  },
  url: {
    secure: true 
  }
});



export default cloudinary

