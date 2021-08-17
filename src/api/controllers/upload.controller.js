const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    //console.log(file);
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

exports.upload = upload.single("avance");
