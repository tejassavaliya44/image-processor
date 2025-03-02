const mongoose = require('mongoose');
const { PROCESS_STATUS } = require('../utils/constants');

const productImageSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    original_image_url: {
        type: String,
        required: true
    },
    processed_image_url: {
        type: String,
        default: null
    },
    compression_status: {
        type: String,
        enum: Object.values(PROCESS_STATUS),
        default: PROCESS_STATUS.PROCESSING
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('product-image', productImageSchema);