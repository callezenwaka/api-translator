'use strict';

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;
// Import util library
// const utils = require('./libs/utils');
const { handleUpload, translateText }  = require('../libs/utils');

const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Creates a client
const translate = new Translate();
const router = express.Router();

/**
 * [START POST File]
 *
 * Create a request. If an image is uploaded, add public URL from cloud storage to firestore
 * @param {object} req Cloud Function request context.
 * @param {object} req.file The Datastore kind of the data to save, e.g. "Transcript".
 * Destrcuture req.file using const {fieldname, fieldname, encoding, mimetype, buffer, size} = req.file
 * @param {string} req.file.fieldname The Datastore kind of the data to save, e.g. "file".
 * @param {string} req.file.originalname The Datastore kind of the data to save, e.g. "file.jpg".
 * @param {string} req.file.encoding The Datastore kind of the data to save, e.g. "7bit".
 * @param {string} req.file.mimetype The Datastore kind of the data to save, e.g. "image/jpg".
 * @param {string} req.file.buffer The Datastore kind of the data to save, e.g. "<Buffer * * * ...>".
 * @param {string} req.file.size The Datastore kind of the data to save, e.g. "104087".
 * @param {object} res Cloud Function response context.
 * @return {string}file  public url
 * PS: For updating nested objects in filePublicUrl, 
 * "dot notation" was used to reference nested fields 
 * within the document when call update() was called
 * Refer to this link: https://stackoverflow.com/a/54580948
 */
// router.post('/image', files.multer.single('file'), files.sendUploadToGCS(), async (req, res) => {
//     if (!req.file) {
//         return res.send("Please choose file to upload!");
//     }
//     if (req.file && req.file.cloudStoragePublicUrl) {
//         console.log(req.file.cloudStoragePublicUrl);
//         return res.send(req.file.cloudStoragePublicUrl);
//     }
//     else {
//         return res.send(`File not uploaded to the database, contact admin!`);
//     }
// });
// [END POST File]

/**
 * [START POST Form Page]
 */
router.post('/', upload.single('file'), async (req, res, next) => {
    const file_name = `${req.file.originalname.split('.')[0]}${Date.now()}`;
    const file_path = `translation/${file_name}.csv`;
    const result = await handleUpload(req.file);
    let counter = 0;
    result.forEach( async (element, i, array) => {
        // let container = [];
        if (i != 0 && i % 100 == 0) {
            let container = (counter == 0) ? array.slice(0, i) : array.slice(counter, i);
            counter = i;
            // console.log(`${container.length} => ${counter}`);
            await translateText(container, file_path);
        } else if (i === array.length - 1) {
            let container = array.slice(counter, i);
            // console.log(`${container.length} => ${counter}`);
            await translateText(container, file_path);
        } else {
            return;
        }
    })
    // const file_path = `translation/${file_name}.csv`;
    // const document_name = `${file_name}.csv`;

    // const text = result;
    // const target = 'fr';
    // let [translations] = await translate.translate(text, target);
    // translations = Array.isArray(translations) ? translations : [translations];
    // let content = `EN,FR\n`;;
    // translations.forEach((translation, i) => {
    //     content += `${result[i]},${translation}\n`;
    // });
    // fs.appendFile(file_path, content, (err) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    // })
    // res.download(file_path, document_name, function (err) {
    //     if (err) {
            /**
             * Handle error, but keep in mind the
             * response may be partially-sent,
             * so check res.headersSent
             */
    //         console.log(err);
    //     }
    // })
    // var heading = 'Welcome Home';
    // res.redirect('/');
    console.log('Here, done!');
    return;
});
// [END POST Form Page]

module.exports = router;