// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

//Import model
const videoModel = require('../models/video_lt');

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());

// Function to upload video from the OBS studio plugin
module.exports.uploadVideo = function (req,res) {
    console.log("video");
    const videoSavingPath = config.videoSavingPath;

    // Get the video from the request
    const videoFile = req.files.lectureVideo;
    console.log(videoFile);

    // Save the video in the location
    videoFile.mv(videoSavingPath + videoFile.name, function(err) {
        if (err)
        {
            res.json({
                success: false,
                msg: err
            });
        }
        else
        {
            // Get other values from the request
            let video = new videoModel();
            video.subject = req.body.subject;
            video.lectureVideo = videoSavingPath + videoFile.name;
            video.status = 'unprocessed';

            video.save(function(err) {
                if (err)
                {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
                else
                {
                    res.json({
                        success:true,
                        msg:'Video uploaded successfully'
                    });
                }

            });
        }

    });
};

