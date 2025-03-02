const Axios = require('axios');

async function triggerWebhook(params) {
    try {
        console.log('Triggering webhook!');
        const port = process.env.PORT || 3000;
        const webhookUrl = `http://localhost:${port}/api/webhook`;
        await Axios.post(webhookUrl, params);
    } catch (error) {
        console.log(error)
        console.log('Error triggering webhook!')
    }
};

module.exports = triggerWebhook;