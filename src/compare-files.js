const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function compareFilesByContent(folderPath) {
    const filesByContent = new Map();

    function calculateFileHash(filePath) {
        const hash = crypto.createHash('sha256');
        const data = fs.readFileSync(filePath);
        hash.update(data);
        return hash.digest('hex');
    }

    function readFilesRecursively(folderPath) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                readFilesRecursively(filePath);
            } else {
                const fileHash = calculateFileHash(filePath);

                if (!filesByContent.has(fileHash)) {
                    filesByContent.set(fileHash, []);
                }
                filesByContent.get(fileHash).push(filePath);
            }
        }
    }

    readFilesRecursively(folderPath);

    return Array.from(filesByContent.values())
        .filter(files => files.length > 1);
}

const folderPath = 'years';
// const folderPath = 'months';
const filesWithSameContent = compareFilesByContent(folderPath);
console.log('Files with the same content:', filesWithSameContent);

/**
 * Months
 * Files with the same content: [
 *   [ 'months/2008_05.txt', 'months/2008_06.txt' ],
 *   [ 'months/2015_03.txt', 'months/2015_04.txt' ],
 *   [ 'months/2016_07.txt', 'months/2016_08.txt' ],
 *   [ 'months/2017_10.txt', 'months/2017_11.txt' ],
 *   [ 'months/2022_05.txt', 'months/2022_06.txt' ],
 *   [ 'months/2022_10.txt', 'months/2022_11.txt' ],
 *   [ 'months/2023_08.txt', 'months/2023_09.txt' ],
 *   [ 'months/2023_11.txt', 'months/2024_00.txt' ]
 * ]
 */

/**
 * Years
 * Files with the same content: [ [ 'years/2022.txt', 'years/2023.txt' ] ]
 */
