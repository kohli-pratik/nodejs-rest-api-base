'use strict';

/**
 * like body-parser is used to parse json body
 * multer is used to handle multi-part form data
 */
const multer = require('multer');
const fs = require('fs');

/**
 * Sets the file storage config
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploadedFiles/');
    },
    filename: (req, file, callback) => {        
        (req.body.multipleVersion === 'true')
            ? callback(null, `${new Date().toISOString().replace(/:/g, '-')}_${file.originalname}`)
            : callback(null, file.originalname)
    }
});

/**
 * File size in bytes
 */
const fileSizeLimit = 1024 * 1024 * 5;

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        if (req.body.multipleVersion === 'false') {
            // Valid file type, check if file already exists
            const filePath = `./uploadedFiles/${file.originalname}`;
            fs.access(filePath, fs.F_OK, (err) => {
                (err)
                    ? callback(null, true) // File does not exists, Accept file
                    : callback(new Error(`${file.originalname} already exists`), false); // File exists, Reject file
            });
        } else {
            callback(null, true)
        }
    } else {
        // Invalid file type, Reject file
        callback(new Error(`Invalid file type - ${file.mimetype}`), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: fileSizeLimit
    },
    fileFilter: fileFilter
});

module.exports = { upload };