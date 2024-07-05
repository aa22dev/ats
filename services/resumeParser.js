const { spawn } = require('child_process');

async function parseResume(resume) {
    try {
        const process = spawn('py', ['services/parser/parser.py', resume]);

        let jsonData = "";

        process.stdout.on('data', (data) => {
            jsonData += data.toString();
        });

        process.stderr.on('data', (data) => {
            throwErr(data.toString(), 500);
        });

        return new Promise((resolve, reject) => {
            process.on('close', (code) => {
                if (code === 0) {
                    try {
                        const parsedData = JSON.parse(jsonData);
                        resolve(parsedData);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error("Python script error"));
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

module.exports = parseResume;