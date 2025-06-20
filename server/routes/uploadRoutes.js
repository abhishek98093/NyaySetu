const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const upload = multer({ dest: 'uploads/' });

router.post('/files', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'your_folder_name', // Optional folder
      resource_type: 'auto' // Automatically detect image/video
    });
    console.log('file saved successfully');
    res.json({
      success: true,
      url: result.secure_url

    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

module.exports = router;