import multer from 'multer';

// Use memoryStorage for Cloudinary - this stores files in memory as buffers
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage, // Change from diskStorage to memoryStorage
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('Multer processing file:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export default upload;