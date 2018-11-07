// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var child_process = require('child_process');

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());

module.exports.runTrackerScript = (req, res) => {

    //console.log('yay');
    //res.json('hello');


    // child_process.exec('Research_CDAP_R\\Lecture_Tracker_and_Move_Camera\\onvif_movement\\lcs_controller.bat', function(error, stdout, stderr) {
    //     console.log(stdout);
    // });

    const { exec } = require('child_process');
    exec('custom_vm.bat', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });




    res.json({
        success:true,
        msg:'Success'
    });



    // videoModel.find({}, function (error, videos) {
    //     if(error){
    //         res.json({
    //             success: false,
    //             msg: error
    //         });
    //     }
    //     else
    //     {
    //         res.json(videos);
    //     }
    // });

};

