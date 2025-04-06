const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for resume files
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vahire/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw'
  }
});

// Configure storage for profile images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vahire/images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Configure storage for project files
const projectFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vahire/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip'],
    resource_type: 'auto'
  }
});

// Create upload middleware
const uploadResume = multer({ storage: resumeStorage });
const uploadImage = multer({ storage: imageStorage });
const uploadProjectFile = multer({ storage: projectFileStorage });

module.exports = {
  cloudinary,
  uploadResume,
  uploadImage,
  uploadProjectFile
}; 