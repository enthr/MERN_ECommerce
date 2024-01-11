import path from 'path';
import { Router } from 'express';
import multer from 'multer';

import { isLoggedIn, authorize } from '../middlewares/auth.middleware.js';
import authRoles from '../utils/authRoles.js';

const router = Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function fileFilter(req, file, cb) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'), false);
    }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

router.post('/', isLoggedIn, authorize(authRoles.ADMIN), (req, res) => {
    uploadSingleImage(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        const filename = req.file.filename;
        const fileUrl = path.join("uploads", filename).replace(/\\/g, "/");

        res.status(200).send({
            message: 'Image Uploaded Successfully',
            image: `${fileUrl}`,
        });
    });
});

export default router;