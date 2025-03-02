const mongoose = require('mongoose');
const { PROCESS_STATUS } = require('../utils/constants');

const requestSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(PROCESS_STATUS),
        default: PROCESS_STATUS.PENDING
    },
    completed_at: {
        type: Date,
        default: null
    },
    output_csv_file: {
        type: String,
        default: null
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

requestSchema.virtual('products', {
    localField: '_id',
    foreignField: 'request_id',
    ref: 'product'
})

module.exports = mongoose.model('request', requestSchema);