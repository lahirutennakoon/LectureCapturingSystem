var mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    coursename: {
        type: String,
        index: { unique: true },
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    modulecode:{
        type: String,
    },
    credits:{
        type: String,
    },
    created: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Course', CourseSchema);