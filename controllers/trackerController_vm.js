// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const child_process = require('child_process');
//for python run
const spawn = require("child_process").spawn;

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());


module.exports.startLectureTracker = (req, res) => {

    console.log('startLectureTracker');

    // const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2]);
    // const pythonProcess = spawn('python',["D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera\\capture_lec_focus_vm.py"]);

    // var PythonShell = require('python-shell');
    //
    // PythonShell.run('D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera\\capture_lec_focus_vm.py', function (err) {
    //     if (err) throw err;
    //     console.log('finished');
    // });


    //var child_process = require('child_process');
    //child_process.execSync('start cmd.exe /K node ');

    child_process.execSync('start cmd.exe /K cd D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera');

    res.json({
        success:true,
        msg:'Camera right'
    });


};

module.exports.startGestureDetection = (req, res) => {

    console.log('startGestureDetection');

    res.json({
        success:true,
        msg:'Camera right'
    });
};

module.exports.stopTracker = (req, res) => {

    console.log('stopTracker');

    res.json({
        success:true,
        msg:'Camera right'
    });

};

module.exports.runTrackerScript = (req, res) => {

    console.log('runTrackerScript Called');

    //res.json('hello');

    /*child_process.exec('notepad', function(error, stdout, stderr) {
        console.log(stdout);
    });

    res.json({
        success:true,
        msg:'Success'
    });*/

    child_process.execSync('start cmd.exe /K cd D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera\\onvif_movement');

    res.json({
        success:true,
        msg:'Camera right'
    });
};

