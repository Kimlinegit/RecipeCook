import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();


//upload image cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadImage = async (req, res) => {
    try {
        console.log(req.files);
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "No files were uploaded!" });
        }

        const file = req.files.file;

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ message: "Size to large!" });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect!" });
        }

        await cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
                folder: "recipeCooks", //thư mục lưu trữ trên cloudinary
                transformation: [{ width: 150, height: 150, crop: 'fill' }] //kích thước ảnh mới
            },
            async (err, result) => {
                if (err) {
                    throw err;
                }
                removeTmp(file.tempFilePath);
                res.json({ public_id: result.public_id, url: result.secure_url });
            }
        );

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const destroyImage = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ msg: "No image selected!" });
        }

        await cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) {
                throw err;
            }
            res.json({ message: "Delete image successful!" });
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) {
            throw err;
        }
    })
}

export {
    uploadImage,
    destroyImage
}


