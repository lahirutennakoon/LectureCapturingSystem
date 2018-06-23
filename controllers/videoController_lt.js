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
    console.log("uploading video");
    const videoSavingPath = config.videoSavingPath;

    // Get the video file from the request
    const videoFile = req.files.lectureVideo;

    // console.log(videoFile);

    const mimeType = videoFile.mimetype.substring(0, 5);
    console.log(mimeType);

    if(mimeType === 'video')
    {
        // Replace spaces and append timestamp to video filename
        let modifiedVideoFilename = videoFile.name.replace(/\s/g,'_');
        const dateTime = new Date();
        console.log('dateTime:' + dateTime);

        const timestamp = dateTime.getTime();
        modifiedVideoFilename = timestamp + '_' + modifiedVideoFilename;
        console.log("modified: " + modifiedVideoFilename);

        // Save the video in the location
        videoFile.mv(videoSavingPath + modifiedVideoFilename, function(err) {
            if (err)
            {
                res.json({
                    success: false,
                    msg: err
                });
            }
            else
            {
                // Get other values from the request and add them to schema model object
                let video = new videoModel();
                video.subject = req.body.subject;
                video.lectureVideo = modifiedVideoFilename;
                video.dateTime = dateTime;
                video.status = 'unprocessed';

                // Save in database
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
    }
    else
    {
        res.json({
            success: false,
            msg: 'Invalid file type.'
        });
    }

};

// Get all lecture videos
module.exports.getAllVideos = function (req, res) {
    videoModel.find({}, function (error, videos) {
        if(error){
            res.json({
                success: false,
                msg: error
            });
        }
        else
        {
            res.json(videos);
        }
    });
};

