const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoChapterSchema = new Schema({
    lectureVideo: {
        type: String
    },

    videoChapter: {
        type: String
    },

    videoChapterText: {
        type: String
    }
});

module.exports = mongoose.model('videoChapter_lt', videoChapterSchema);