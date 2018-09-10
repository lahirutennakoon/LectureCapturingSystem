var express = require('express')
var router = express.Router()
var attendanceController = require('../controllers/attendanceController_aj')
const config = require('../configurations/config');
var request = require('request');


router.post('/attendance', function(req, res, next) {
    attendanceController.markAttendance(req.body.imageString, function(err,username,usertype,userID){
        if(err){
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(username){

            res.status(200).json({
                success: 1,
                data: { username: username, usertype: usertype, userid: userID}
            });
        }else{
            res.status(401).json({
                success: 0
            });
        }
    });

});



module.exports = router