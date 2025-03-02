const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    serial_number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'request',
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

productSchema.virtual('product_images', {
    localField: '_id',
    foreignField: 'product_id',
    ref: 'product-image'
});

module.exports = mongoose.model('product', productSchema);