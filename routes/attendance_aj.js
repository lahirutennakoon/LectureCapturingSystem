var express = require('express')
var router = express.Router()
var attendanceController = require('../controllers/attendanceController_aj')
const config = require('../configurations/config');
var request = require('request');

router.get('/markAttendance2', function (req, res, next) {
    attendanceController.markAttendance2(function (err, success) {
        if (err) {
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if (success) {

            res.status(200).json({
                success: 1
            });
        } else {
            res.status(401).json({
                success: 0
            });
        }
    });
});


router.get('/releaseWebCam', function (req, res, next) {

    request(config.attendancePythonUrl, function (error, response, body) {
        if (error) {
            console.log('"camrelease().request().error: ', error);
        }

        console.log("response :" + response);
        console.log("body :" + body);
        res.status(200).json({
            success: 1
            // data: {tokenID: result, username: username, usertype: usertype, userid: userID}
        });
    });

});

router.post('/delete', function (req, res, next) {
    attendanceController.deleteAttendance(req.body.attendanceId, function (err, result) {
        if (err) {
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if (result) {

            res.status(200).json({
                success: 1
                // data: {tokenID: result, username: username, usertype: usertype, userid: userID}
            });
        } else {
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.get('/getAllAttendance', function (req, res, next) {
    attendanceController.getAllAttendance(function (err, result) {
        if (err) {
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if (result) {
            res.status(200).json({
                success: 1,
                data: { result }
            });
        } else {
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.post('/attendance', function (req, res, next) {
    attendanceController.markAttendance(req.body.imageString, function (err, success) {
        if (err) {
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if (success) {

            res.status(200).json({
                success: 1
            });
        } else {
            res.status(401).json({
                success: 0
            });
        }
    });

});



module.exports = router