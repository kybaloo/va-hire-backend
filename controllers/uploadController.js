const User = require('../models/User');
const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.auth.sub; // From Auth0

    // Update user profile with the image URL
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: userId },
      { profileImage: req.file.path },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      imageUrl: req.file.path,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Error uploading profile image', error: error.message });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.auth.sub; // From Auth0

    // Update user profile with the resume URL
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: userId },
      { resume: req.file.path },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeUrl: req.file.path,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
};

// Upload project file
exports.uploadProjectFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { projectId } = req.params;
    
    // Check if the project exists and the user owns it
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Add the file URL to the project
    project.attachments = project.attachments || [];
    project.attachments.push({
      url: req.file.path,
      filename: req.file.originalname,
      mimetype: req.file.mimetype
    });
    
    await project.save();

    res.status(200).json({
      message: 'Project file uploaded successfully',
      fileUrl: req.file.path,
      project
    });
  } catch (error) {
    console.error('Error uploading project file:', error);
    res.status(500).json({ message: 'Error uploading project file', error: error.message });
  }
};

// Delete uploaded file
exports.deleteFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL is required' });
    }
    
    // Extract public ID from the URL
    const publicId = fileUrl.split('/').pop().split('.')[0];
    
    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      return res.status(400).json({ message: 'Error deleting file from Cloudinary' });
    }
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
}; 