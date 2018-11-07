// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const child_process = require('child_process');

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());


module.exports.startLectureTracker = (req, res) => {

    console.log('startLectureTracker');
};

module.exports.startGestureDetection = (req, res) => {

    console.log('startGestureDetection');
};

module.exports.stopTracker = (req, res) => {

    console.log('stopTracker');
};

module.exports.runTrackerScript = (req, res) => {

    console.log('yay');
    //res.json('hello');

    child_process.exec('notepad', function(error, stdout, stderr) {
        console.log(stdout);
    });

    res.json({
        success:true,
        msg:'Success'
    });


    // courseModel.find({}, function (error, res) {
    //     if(error){
    //         res.json({
    //             success: false,
    //             msg: error
    //         });
    //     }
    //     else
    //     {
    //         res.json(res);
    //     }
    // });

};

