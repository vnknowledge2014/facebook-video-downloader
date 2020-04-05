#!/usr/bin/env node

const path = require('path');
const http = require('https');
const fs = require('fs');
const exec = require('child_process').execSync;

const [fileName, videoLink, audioLink] = process.argv.slice(2);
const fbDataSource = [videoLink, audioLink];

function dl(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => { }); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve();
        });

        file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => { }); // Delete temp file
                reject(err.message);
            }
        });
    });
}

const checkExist = () => {
    try {
        if (fs.existsSync(`${fileName}_${fbDataSource.indexOf(videoLink)}.mp4`) || fs.existsSync(`${fileName}_${fbDataSource.indexOf(audioLink)}.mp4`) || fs.existsSync(`${fileName}.mp4`)) {
            exec(`rm ${path.dirname(fileName)}/*.mp4`);
            fbDataSource.forEach((item, idx) => {
                dl(item, `${fileName}_${idx}.mp4`)
            });

            setTimeout(() => {
                exec(`ffmpeg -i ${fileName}_${fbDataSource.indexOf(videoLink)}.mp4 -i ${fileName}_${fbDataSource.indexOf(audioLink)}.mp4 -c:v copy -c:a copy ${fileName}.mp4`);
                exec(`rm -rf ${fileName}_${fbDataSource.indexOf(videoLink)}.mp4 ${fileName}_${fbDataSource.indexOf(audioLink)}.mp4`);
            }, 5000);
        } else {
            fbDataSource.forEach((item, idx) => {
                dl(item, `${fileName}_${idx}.mp4`)
            });

            setTimeout(() => {
                exec(`ffmpeg -i ${fileName}_${fbDataSource.indexOf(videoLink)}.mp4 -i ${fileName}_${fbDataSource.indexOf(audioLink)}.mp4 -c:v copy -c:a copy ${fileName}.mp4`);
                exec(`rm -rf ${fileName}_${fbDataSource.indexOf(videoLink)}.mp4 ${fileName}_${fbDataSource.indexOf(audioLink)}.mp4`);
            }, 5000);
        }
    } catch (err) {
        console.error(err)
    }
}

checkExist();

