// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stuchama/profile_pics',
    allowed_formats: ['jpg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }]
  }
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stuchama/meeting_notes',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // Important for PDF files
    filename_override: (req, file) => {
      const name = file.originalname.replace(/\.pdf$/, '');
      return `${name}-${Date.now()}.pdf`; // ensures filename.pdf
    }
  }
});


module.exports = {
  cloudinary,
  profilePicStorage,
  pdfStorage
};
