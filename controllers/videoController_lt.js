// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cmd=require('node-cmd');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

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
        'scenedetect -i ' + config.videoSavingPath + req.body.lectureVideo + ' -d content -t 2 -o ' + config.videoSavingPath + chapterName + '_chapter.mp4 -co ' + config.videoSavingPath +'scenes.csv -q',
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

                // Array to hold video chapter names
                const videoChapters = [];

                const csvFilePath= config.videoSavingPath + 'scenes.csv';
                const csv=require('csvtojson');
                csv()
                    .fromFile(csvFilePath)
                    .then((jsonObjArray)=>{
                        console.log('json');
                        // console.log(jsonObjArray);
                        console.log('length:' + jsonObjArray.length);

                        if(jsonObjArray.length<12 )
                        {
                            for(let i=1; i<jsonObjArray.length; i++)
                            {
                                let chapter = chapterName + '_chapter-00' + i + '.mp4';
                                // console.log(chapter);
                                // Add video chapter to array
                                videoChapters.push(chapter);

                                // Convert video to audio using ffmpeg
                                const proc = new ffmpeg({ source: config.videoSavingPath + chapter, nolog: true });
                                proc.setFfmpegPath(config.ffmpegPath)
                                    .toFormat('mp3')

                                    .on('end', function() {
                                        console.log('Video file converted to audio successfully');
                                    })
                                    .on('error', function(err) {
                                        console.log('Error: ' + err.message);
                                    })
                                    // save to audio file
                                    .saveToFile(config.videoSavingPath + chapterName + '_chapter-00' + i + '.mp3');
                            }

                            console.log('array');
                            console.log(videoChapters);
                        }

                        // Append video chapter array to request body
                        req.body.videoChapters = videoChapters;

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
                        });

                    });

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

// Get a single video
module.exports.getOneVideo = function (req, res) {
    videoModel.find({'lectureVideo': req.query.lectureVideo}, function (error, response) {
        if(error)
        {
            res.json({
                success: false,
                msg: error
            });
        }
        else
        {
            res.json(response);
        }
    })
};

//TEST
module.exports.test = function (req, res) {

    // Create an object of SpeechToText
    /*const speech_to_text = new SpeechToTextV1({
        "username": "c70e62af-7ac6-4b2b-8c03-2c29c90bca0a",
        "password": "ZsN5o7UPmqQi"
    });

    const files = ['D:/SLIIT/Year4,Semester1/CDAP/Prototype/LectureSystemClient/public/videos/audio.mp3'];

    for (let file in files)
    {
        const params = {
            audio: fs.createReadStream(files[file]),
            content_type: 'audio/mp3'
        };

        speech_to_text.recognize(params, function (error, transcript) {
            if (error)
            {
                console.log('Error:'+  error);
            }
            else
            {
                console.log('success');
                console.log(transcript);

                for(let i=0; i<transcript.results.length; i++)
                {
                    console.log(transcript.results[i].alternatives[0].transcript);
                    console.log('NEW');
                }
                // console.log(JSON.stringify(transcript, null, 2));
                // console.log(transcript.results[0].alternatives[0].transcript);
                //     console.log(transcript.results[1].alternatives[0].transcript);
            }
        });
    }*/

    const proc = new ffmpeg({ source: '../LectureSystemClient/public/videos/1531154162004_lec2_cdap_chapter-001.mp4', nolog: true });

    proc.setFfmpegPath("F:/Program Files/ffmpeg-20180706-cced03d-win64-static/bin/ffmpeg.exe")
    .toFormat('mp3')

        .on('end', function() {
            console.log('file has been converted successfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        // save to file <-- the new file I want -->
        .saveToFile('../LectureSystemClient/public/videos/1531154162004_lec2_cdap_chapter-001.mp3');
    console.log('done');
};