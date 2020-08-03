'use strict'

const express = require('express');

/**
 * 
 * @param {*} inputFile 
 */
const handleUpload = async (file) => {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt|.tsv)$/;
    if (regex.test(file.originalname.toLowerCase())) {
        if (typeof (file) != "undefined") {
            const fileContents = await fs.readFileSync(file.path, 'utf8');
            var row = fileContents.split('\r\n');
            var word_list = [];
            row.filter(x => {
                if(x != '') word_list.push(x);
            })
            return word_list;
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
      alert("Please upload a valid CSV or TSV file.");
    }
}

const translateText = async (container, location) => {
    // const file_path = `translation/${file}.csv`;
    // const document_name = `${file}${count}.csv`;
    let content = '';
    const text = container;
    const target = 'fr';
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    // let content = `EN,FR\n`;;
    translations.forEach((translation, i) => {
        content += `${container[i]},${translation}\n`;
    });
    fs.appendFile(location, content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

module.exports = {
    handleUpload,
    translateText,
};