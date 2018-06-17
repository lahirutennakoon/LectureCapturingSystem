const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    subject:{
        type: String,
        required: true
    },
    lecture: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('video_lt', videoSchema);
