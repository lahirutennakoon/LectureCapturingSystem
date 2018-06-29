const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    subject:{
        type: String,
        required: true
    },
    videoName: {
        type: String,
        required: true
    },
    lectureVideo: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    videoChapters: [{
        type: String
    }]
});

module.exports = mongoose.model('video_lt', videoSchema);
