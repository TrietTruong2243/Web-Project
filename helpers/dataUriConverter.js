const path = require('path');
const DatauriParser = require('datauri/parser');

const toDataUri = (file) => {
    const parser = new DatauriParser();
    const extName = path.extname(file.originalname).toString();
    let base64 = parser.format(extName, file.buffer);

    return base64.content;
}

module.exports = toDataUri;