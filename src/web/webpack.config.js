module.exports = {
    entry: {
        app: './lib/index.js'
    },

    output: {
        path: __dirname + '/asset',
        filename: '[name].js'
    }
};
