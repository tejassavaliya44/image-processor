const csvtojson = require('csvtojson');
const HttpError = require('http-errors');
const { fork } = require('child_process');
const Request = require('../../models/request');
const path = require('path');

async function initiateProcessRequest(files) {
    const file = files?.products;
    if (!file) throw new HttpError[422]('please upload valid file in csv format along with products property!');
    const { name, mimetype, data: fileData } = file;
    if (mimetype != 'text/csv') throw new HttpError[422]('please upload valid file in csv format!');
    const jsonData = await csvtojson({ checkColumn: true, trim: true }).fromString(fileData.toString());
    const jsonDataLength = jsonData.length;
    const finalData = [];
    for (let recordIndex = 0; recordIndex < jsonDataLength; recordIndex++) {
        const csvProductObj = jsonData[recordIndex];
        const csvKeys = Object.keys(csvProductObj);
        const csvValues = Object.values(csvProductObj);
        if (csvKeys.length != 3 || csvValues.length != 3) throw new HttpError[422](`Incorrect CSV data format at record ${recordIndex + 1}!`);
        const productKeys = ['serial_number', 'name', 'images'];
        const finalProductObj = {};
        csvValues.forEach((value, index) => {
            if (!value) throw new HttpError[422](`please provide valid value for record ${recordIndex + 1}!`);
            finalProductObj[productKeys[index]] = value;
        });
        finalData.push(finalProductObj);
    }
    const requestObj = { file_name: name };
    const request = await Request.create(requestObj);
    const child = fork(path.join(__dirname, 'process.js'));
    child.send({ name, request_id: request._id, data: finalData });
    child.on('message', async (message) => {
        console.log(`Processing complete with status ${message.status} for requestId: ${request._id}`);
        // trigger webhook
        await require('../webhook/trigger')({ message });
    });
    child.on('error', (error) => {
        console.error(`Processing error: ${error}`);
    });
    child.on('exit', (code) => {
        if (code === 0) {
            console.log(`Child process finished with code ${code}`);
        } else {
            console.error(`Child process exited with code ${code}`);
        }
    });
    return {
        message: 'Processing request has been initiated successfully!',
        data: { request_id: request._id }
    }
}

module.exports = initiateProcessRequest;