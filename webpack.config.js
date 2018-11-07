const path = require('path');

module.exports = {
    entry: './table/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'tableRendering.js'
    }
};