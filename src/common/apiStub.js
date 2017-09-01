module.exports = {
    loadViewFile: {
        type: 'function',
        validateParamItem: (paramValue, index) => {
            if (index === 0) {
                if (!paramValue) {
                    throw new Error('view file can not be empty!');
                }
            }
        }
    }
};
