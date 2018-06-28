// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cmd=require('node-cmd');
var fs = require('fs');

//Import model
const videoModel = new require('../models/video_lt');

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());

// Function to upload video from the OBS studio plugin
module.exports.uploadVideo = function (req,res) {
    console.log("uploading video");
    const videoSavingPath = config.videoSavingPath;

    // If directory to save videos does not exist, make a directory
    if (!fs.existsSync(videoSavingPath))
    {
        fs.mkdirSync(videoSavingPath);
    }

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
                video.videoName = req.body.videoName;
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

// Create video chapters by splitting a video
module.exports.createVideoChapters = function (req, res) {
    console.log('creating chapters');

    const chapterName = req.body.lectureVideo.toString().substr(0, req.body.lectureVideo.length-4);

    cmd.get(
        'scenedetect -i ' + config.videoSavingPath + req.body.lectureVideo + ' -d content -t 1 -o ' + config.videoSavingPath + chapterName + '_chapter.mp4 -co ' + config.videoSavingPath +'scenes.csv',
        function(err, data, stderr){
            if(err){
                console.log("error");
                res.json({
                    success: false,
                    msg: err
                });
            }
            else if(data){
                console.log("data");
                console.log(data);

                const csvFilePath= config.videoSavingPath + 'scenes.csv';
                const csv=require('csvtojson');
                csv()
                    .fromFile(csvFilePath)
                    .then((jsonObj)=>{
                        console.log('json');
                        console.log(jsonObj);
                        /**
                         * [
                         * 	{a:"1", b:"2", c:"3"},
                         * 	{a:"4", b:"5". c:"6"}
                         * ]
                         */
                    });

                // Update status to processed in database
                videoModel.findOneAndUpdate({'lectureVideo': req.body.lectureVideo}, req.body, function (error, success) {
                    if(error)
                    {
                        res.json({
                            success: false,
                            msg: error
                        });
                    }
                    else
                    {
                        res.json({
                            success: true,
                            msg: data
                        });
                    }
                })

            }
            else if(stderr){
                console.log("stderr");
                console.log(stderr);
                res.json({
                    success: false,
                    msg: stderr
                });
            }

        }
    );

};