const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    customers: [String],
    success: {
        type: Boolean,
        required: true,
    },
    upcoming: {
        type: Boolean,
        required: true,
    },
});

// connect launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);