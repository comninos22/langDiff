
import lr from "line-reader";
import Promise from "bluebird"
import fs from "fs";
let path1 = "./lang1"
let path2 = "./lang2";
let eachLine = Promise.promisify(lr.eachLine)
findDiff();
async function findDiff() {
    const common = await readDir("./lang1");
    const httpdocs = await readDir("./lang2");
    const mergedFiles = [];
    for (const file of common) {
        let diffFile = true;
        let diffLines = []
        for (const anotherFile of httpdocs) {
            console.log(file.name);
            if (file.name == anotherFile.name) {
                for (const line of file.lines) {
                    let diffLine = true;
                    for (const anotherLine of anotherFile.lines) {
                        if (line == anotherLine) {
                            diffLine = false;
                        }
                    }
                    if (diffLine) {
                        diffFile = true;
                        diffLines.push(line)
                    }
                }
            }
        }
        if (diffFile) {
            mergedFiles.push({ name: file.name, lines: diffLines })
        }
    }
    console.log(mergedFiles)
}
async function readDir(dirPath) {
    let allAssocs = []
    const files = fs.readdirSync(dirPath)
    for (const file of files) {
        const assoc = await scanFile(dirPath, file)
        allAssocs.push(assoc)
    }
    return allAssocs
}
async function scanFile(dirPath, file) {
    let assocArray = []
    let tempAssoc = "";
    return await eachLine(`${dirPath}/${file}`, (line1) => {
        if (isStartOfAssoc(line1)) {
            tempAssoc = ""
        }
        tempAssoc += line1;
        if (isEndOfAssoc(line1)) {
            assocArray.push(tempAssoc);
        }
    }).then(() => {
        return { name: file, lines: assocArray }
    })
}
function isStartOfAssoc(line) {
    return line.match(/^\$.*/)
}
function isEndOfAssoc(line) {
    return line.match(/^.*";/)
}
console.log("hi")