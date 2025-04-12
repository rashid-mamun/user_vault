const multer = require('multer');
const path = require('path');

/* 
File upload folder 
*/
const UPLOADS_FOLDER = process.env.image_folder;

const imagePath = path.join(process.cwd(),UPLOADS_FOLDER)
console.log(imagePath);
// var upload = multer({ dest: UPLOADS_FOLDER });

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

// preapre the final multer upload object
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only .pdf format allowed!'));
      }
    } else {
      cb(new Error('There was an unknown error!'));
    }
  },
});

module.exports = upload;
