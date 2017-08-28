'use strict';

let webpack = require('webpack');
let promisify = require('es6-promisify');
let fs = require('fs');
let path = require('path');
let uuidv4 = require('uuid/v4');
let del = require('del');

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

let codeTpler = (viewPath) => `let TestedView = require("${viewPath}");let {clearEvents} = require("kabanery");module.exports = {TestedView, clearEvents};`;

module.exports = (viewPath) => {
    let code = codeTpler(viewPath);

    const tmpDir = path.join(__dirname, './__tmp');
    const tmpSourceFileName = `__tmp_src_${uuidv4()}.js`;
    const tmpTarFileName = `__tmp_target_${uuidv4()}.js`;

    // makes tmp file at the same directory with test file
    const tmpSourceFilePath = path.join(path.dirname(viewPath), tmpSourceFileName);

    const tmpTarFilePath = path.join(tmpDir, tmpTarFileName);

    return writeFile(tmpSourceFilePath, code, 'utf-8').then(() => {
        let compiler = webpack({
            entry: {
                app: [tmpSourceFilePath]
            },
            output: {
                path: tmpDir,
                filename: tmpTarFileName
            }
        });

        return new Promise((resolve, reject) => {
            try {
                compiler.run((err, stats) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stats);
                    }
                });
            } catch (err) {
                reject(err);
            }
        }).then(() => {
            return readFile(tmpTarFilePath, 'utf-8');
        }).then((cnt) => {
            return del([tmpTarFilePath, tmpSourceFilePath], {
                force: true
            }).then(() => {
                return cnt;
            });
        }).then((viewCode) => {
            return {
                viewCode
            };
        });
    });
};
