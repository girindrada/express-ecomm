import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads') // pastikan ada folder uploads di root project
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = 'product-' + Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

// filter hanya menerima file jpeg,jpg, dan png
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Hanya file JPEG?JPG?PNG yang diperbolehkan"));
    }
}

const upload = multer({ storage: storage, fileFilter })