module.exports = {
    loadViewFile: {
        type: 'function',
        validateParamItem: (paramValue, index) => {
            if (index === 0) {
                if (!paramValue) {
                    throw new Error('view file path can not be empty!');
                }
            }
        }
    },

    addCase: {
        type: 'function',
        validateParamItem: (paramValue, index) => {
            if (index === 0) {
                if (!paramValue) {
                    throw new Error('test file path can not be empty!');
                }

            } else if (index === 1) {
                if (!paramValue) {
                    throw new Error('debug view code can not be empty!');
                }
            }
        }
    },

    getCaseList: {
        type: 'function',
        validateParamItem: (paramValue, index) => {
            if (index === 0) {
                if (!paramValue) {
                    throw new Error('case file path can not be empty!');
                }
            }
        }
    }
};
