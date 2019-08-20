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
        callback(null, `${new Date().toISOString().replace(/:/g, '-')}_${file.originalname}`)
    }
});

/**
 * File size in bytes
 */
const fileSizeLimit = 1024 * 1024 * 5;

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callback(null, true)
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