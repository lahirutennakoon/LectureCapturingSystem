// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const child_process = require('child_process');
const child_process2 = require('child_process');
//for python run
//const spawn = require("child_process").spawn;
const cmd = require('node-cmd');
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

    // cmd.get(
    //     'python D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera\\lec_tracker_move_cam.py',
    //     function(err, data, stderr){
    //         console.log('the current working dir is : ',data);
    //         console.log('the current working dir is : ',err);
    //         console.log('the current working dir is : ',stderr);
    //     }
    // );

    child_process.execSync('start cmd.exe /K cd D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera');

    res.json({
        success:true,
        msg:'Lec Tracker Started'
    });

};


module.exports.saveIPStream = (req, res) => {

    console.log('saveIPStream started!');

    // cmd.get(
    //     'ffmpeg -re -acodec pcm_s16le -ac 1 -rtsp_transport tcp -i rtsp://192.168.1.110:554/1/h264major -vcodec copy -acodec libfdk_aac -vbr 5 C:\\Lecture_Videos\\lec_recording.ts',
    //     function(err, data, stderr){
    //         console.log('the current working dir is : ',data);
    //         console.log('error : ',err);
    //         console.log('stderr : ',stderr);
    //     }
    // );
    //var fileName = new Date(Date.now()).toLocaleString();
    //var fileName = new Date(Date.now()).toLocaleString().replace('-', '.').replace('-', '.').replace(':', '.').replace(':', '.');

    var d = new Date();
    var df = d.getMonth()+'-'+d.getDate()+'-'+(d.getHours())+'_'+d.getMinutes();
    var fileName = 'lcs_ip_record_'+df;
    console.log(fileName);


//    child_process.execSync('start cmd.exe /K ffmpeg -re -acodec pcm_s16le -ac 1 -rtsp_transport tcp -i rtsp://192.168.1.110:554/1/h264major -vcodec copy -acodec libfdk_aac -vbr 5 C:\\Lecture_Videos\\lec_recording.ts');
   // child_process.execSync('start cmd.exe /K ffmpeg -re -acodec pcm_s16le -ac 1 -rtsp_transport tcp -i rtsp://192.168.1.110:554/1/h264major -vcodec copy -acodec libfdk_aac -vbr 5 C:\\Lecture_Videos\\'+fileName+'.ts');
    child_process.execSync('start cmd.exe /K ffmpeg -re -acodec pcm_s16le -ac 1 -rtsp_transport tcp -i rtsp://192.168.1.110:554/1/h264major -vcodec copy -acodec libfdk_aac -vbr 5 C:\\Lecture_Videos\\'+fileName+'.mp4');

    res.json({
        success:true,
        msg:'saveIPStream'
    });
};


module.exports.startGestureDetection = (req, res) => {

    console.log('startGestureDetection');
    child_process.execSync('start cmd.exe /K cd D:\\Research_CDAP_R\\Lecture_Tracker_and_Move_Camera');
    res.json({
        success:true,
        msg:'Camera'
    });
};

module.exports.stopTracker = (req, res) => {

    console.log('stopTracker');

    //child_process2.execSync('start cmd.exe /K taskkill /F /IM cmd.exe');
    cmd.get(
        'taskkill /F /IM cmd.exe',
        function(err, data, stderr){
            //console.log('the current working dir is : ',data);
            //console.log('error : ',err);
            //console.log('stderr : ',stderr);
        }
    );

    res.json({
        success:true,
        msg:'stop tracker'
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

