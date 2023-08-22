const multer = require("multer");
const path = require("path");

// const MIMES_TYPES = {
//     "image/jpg" : "jpg",
//     "image/jpeg" : "jpg",
//     "image/png" : "png",
//     "image/webp" : "webp"
// }

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../../front-end/public/assets/images/streamers'),
    filename : (req, file, callback) => {
        const originalNameWithoutExtension = path.parse(file.originalname).name;
        const sanitizedName = originalNameWithoutExtension.replace(/\s/g, '-');
        const newFileName = `temp_${sanitizedName}${path.extname(file.originalname)}`;
        callback(null, newFileName);
    }
});

const upload = multer({storage: storage }).single('file');

exports.uploadMiddlewaire = (req, res, next) => {
    upload(req, res, function(err) {
        if(err) {
            console.log(err);
            return res.status(500).json({ error: "Error uploading file. " });
        }
        next();
    });
}