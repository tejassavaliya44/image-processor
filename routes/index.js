const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const validation = require('../utils/validation');
const validator = require('../middlewares/validator');

router.use(fileUpload());

router.post('/upload', async function _initiateUploadRequest(req, res, next) {
    try {
        const data = await require('../controllers/request/upload')(req.files);
        return res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/status/:requestId', validator(validation.requestIdValidation),
    async function _getRequestStatus(req, res, next) {
        try {
            const data = await require('../controllers/request/status')(req.params.requestId);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/request/:requestId', validator(validation.requestIdValidation),
    async function _getRequestDetails(req, res, next) {
        try {
            const data = await require('../controllers/request/get')(req.params.requestId);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/webhook', async function _respondWebhook(req, res, next) {
    try {
        console.log('Webhook request received successfully!');
        return res.send();
    } catch (error) {
        next(error);
    }
});

router.get('/health', async function _healthCheck(req, res, next) {
    try {
        const data = await require('../controllers/health')();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(503).send();
    }
});

module.exports = router;
