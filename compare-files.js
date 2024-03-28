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

    // Read files from the folder recursively
    function readFilesRecursively(folderPath) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // Recursively read files from subdirectories
                readFilesRecursively(filePath);
            } else {
                // Calculate hash of the file's content
                const fileHash = calculateFileHash(filePath);

                // Add file to the Map based on its hash
                if (!filesByContent.has(fileHash)) {
                    filesByContent.set(fileHash, []);
                }
                filesByContent.get(fileHash).push(filePath);
            }
        }
    }

    // Call the function to read files recursively
    readFilesRecursively(folderPath);

    // Filter files with the same content
    return Array.from(filesByContent.values())
        .filter(files => files.length > 1);
}

// Example usage:
const folderPath = 'years';
// const folderPath = 'months';
const filesWithSameContent = compareFilesByContent(folderPath);
console.log('Files with the same content:', filesWithSameContent);

/**
 * Months
 * Files with the same content: [
 *   [ 'responses/2008_05.txt', 'responses/2008_06.txt' ],
 *   [ 'responses/2015_03.txt', 'responses/2015_04.txt' ],
 *   [ 'responses/2016_07.txt', 'responses/2016_08.txt' ],
 *   [ 'responses/2017_10.txt', 'responses/2017_11.txt' ],
 *   [ 'responses/2022_05.txt', 'responses/2022_06.txt' ],
 *   [ 'responses/2022_10.txt', 'responses/2022_11.txt' ],
 *   [ 'responses/2023_08.txt', 'responses/2023_09.txt' ],
 *   [ 'responses/2023_11.txt', 'responses/2024_00.txt' ]
 * ]
 */

/**
 * Years
 * Files with the same content: [ [ 'years/2022.txt', 'years/2023.txt' ] ]
 */
