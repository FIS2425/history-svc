import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Multer configuration for temporary file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Temporary storage directory
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname.split('.')[0]; // Get the original filename without the extension
      const fileExtension = file.originalname.split('.')[1]; 
      cb(null, `${originalName}-${uuidv4()}.${fileExtension}`); // Unique filename with original name and extension
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB file size limit
});

export default upload.single('file'); 