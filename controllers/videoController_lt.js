const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const videoModel = require('../models/video_lt');

router.use(bodyParser.json());

module.exports.uploadVideo =  (req, res) => {
    let video = new videoModel();
    video.subject = req.body.subject;
    video.lecture = req.body.lecture;
    video.status = req.body.status;

    video.save(function(err) {
        if (err) {
            res.send(err);
        }
        res.json({
            success:true,
            msg:'Video uploaded successfully'});
    });

    console.log(video);

};

