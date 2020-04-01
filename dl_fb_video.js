#!/usr/bin/env node

const path = require('path');
const http = require('https');
const fs = require('fs');
const exec = require('child_process').execSync;

const [fileName, videoLink, audioLink] = process.argv.slice(2);
const fbDataSource = [videoLink, audioLink];

const dl = (path, file) => {
    let f = fs.createWriteStream(file);

    http.get(path, function (res) {
        res.on('data', function (chunk) {
            f.write(chunk);
        });
        res.on('end', function () {
            f.end();
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

