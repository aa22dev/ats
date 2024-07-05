const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Applicant = require('../models/applicants.js');

const uploadDir = path.join(__basedir, 'public', 'uploads', 'images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 2 } // Max 2 MB File Size Limit
});

const profileController = {
    uploadProfile: upload.single('profile_picture'),
    updateDp: async (req, res, next) => {
        try {
            const { userId } = req;
            const dp = req.file;
            if (!dp) {
                throwErr("No image uploaded", 400)
            }
            await Applicant.updateDp(userId, `/uploads/images/${dp.filename}`);
            res.status(200).json({ message: "Profile Picture Updated!" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = profileController