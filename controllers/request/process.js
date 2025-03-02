require('dotenv').config();
const sharp = require('sharp');
const fs = require('fs');
const crypto = require('crypto');
const { json2csv } = require('json-2-csv');
const Axios = require('axios');
const moment = require('moment');
const path = require('path');
const Product = require('../../models/product');
const ProductImage = require('../../models/product-image');
const Request = require('../../models/request');
const { PROCESS_STATUS } = require('../../utils/constants');

process.on('message', async (params) => {
    await require('../../services/dbService')();
    const { name, request_id: requestId, data: productsArr } = params;
    try {
        const productsLength = productsArr.length;
        for (let productIndex = 0; productIndex < productsLength; productIndex++) {
            const productObj = productsArr[productIndex];
            const { serial_number, name, images } = productObj;
            const productObject = { serial_number, name, request_id: requestId };
            console.log('Processing product: ', serial_number);
            const product = await Product.create(productObject);
            const productId = product._id;
            const imagesArr = images.split(',');
            const imagesLength = imagesArr.length;
            const dirPath = path.join(__dirname, '../../public/images');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            const processedImages = [];
            for (let imageIndex = 0; imageIndex < imagesLength; imageIndex++) {
                const imageUrl = imagesArr[imageIndex];
                const imageObj = { product_id: productId, original_image_url: imageUrl };
                const productImage = await ProductImage.create(imageObj);
                // process the product images and update compression status
                try {
                    const response = await Axios.get(imageUrl, { responseType: 'arraybuffer' });
                    const imageData = response.data;
                    const imageKey = `${serial_number}-${crypto.randomUUID()}`;
                    const compressedImagePath = path.join(dirPath, `${imageKey}.jpeg`);
                    // reduce image quality to 50% and store the result
                    await sharp(imageData).jpeg({ quality: 50 }).toFile(compressedImagePath);
                    productImage.processed_image_url = compressedImagePath;
                    productImage.compression_status = PROCESS_STATUS.COMPLETED;
                    processedImages.push(compressedImagePath);
                    await productImage.save();
                } catch (error) {
                    console.log(error?.message);
                    productImage.compression_status = PROCESS_STATUS.FAILED;
                    await productImage.save();
                }
            }
            productObj['output_image_urls'] = processedImages.join(',');
        }
        // update the request status
        await Request.findByIdAndUpdate(requestId, { status: PROCESS_STATUS.COMPLETED, completed_at: moment().format() });
        process.send({ status: PROCESS_STATUS.COMPLETED });
        // generate output csv file
        const csvData = json2csv(productsArr);
        const csvFileName = name?.split('.')[0] ? name.split('.')[0] : name;
        const csvDirPath = path.join(__dirname, '../../public/csv');;
        if (!fs.existsSync(csvDirPath)) {
            fs.mkdirSync(csvDirPath);
        }
        const outFilePath = `${csvDirPath}/${csvFileName}-out.csv`;
        fs.writeFile(outFilePath, csvData, 'utf-8', async (err) => {
            if (err) {
                console.log('Error saving output csv file!');
            } else {
                console.log('output csv file generate successfully!');
                await Request.findByIdAndUpdate(requestId, { output_csv_file: outFilePath });
            }
        });
    } catch (error) {
        console.log(error);
        await Request.findByIdAndUpdate(requestId, { status: PROCESS_STATUS.FAILED });
        process.send({ status: PROCESS_STATUS.FAILED });
    }
});