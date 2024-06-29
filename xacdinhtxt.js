const fs = require('fs');
const path = require('path');


function loadFileContents(folderPath) {
    let fileContents = {};
    fs.readdirSync(folderPath).forEach((file) => {
        if (path.extname(file) === ".txt") {
            const filePath = path.join(folderPath, file);
            const fileName = path.basename(file, ".txt");
            try {
                const content = fs.readFileSync(filePath, "utf8");
                fileContents[fileName] = content;
            } catch (error) {
                console.error(`Không tìm thấy ${filePath}: ${error.message}`);
            }
        }
    });
    return fileContents;
}

module.exports = loadFileContents;
