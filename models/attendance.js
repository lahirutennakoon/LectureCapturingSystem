const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
