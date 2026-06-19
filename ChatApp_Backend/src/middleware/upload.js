const multer = require('multer');
const path = require('path');
const fs = require('fs');

const getMulterStorage = (folderName = 'others') => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = `uploads/${folderName}`;
      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    }
  });
};

const getUploader = (folderName) => multer({ storage: getMulterStorage(folderName) });

module.exports = getUploader;
