
var jwt = require('jsonwebtoken');
const config = require('../configurations/config');
var User = require('../models/authentication/User_aj')
var backupUsers = require('../models/authentication/password_aj')
var User = require('../models/authentication/User_aj')
var Attendance = require('../models/attendance')
const fs = require('fs');
const PythonShell = require('python-shell');
var request = require('request');

module.exports = {

    
    deleteAttendance: function (attendanceID, callback) {
        
        Attendance.findByIdAndRemove(attendanceID,

            function (err) {
                if (err) {
                    callback(err, null);
                } 
                    console.log("attendanceID:"+attendanceID+ " Deleted!");
                    callback(null, "Attendance Row Deleted");
                
            });
    },
    getAllAttendance: function (callback) {
        Attendance.find({}, function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        });
    },
    markAttendance: function (imageBase64String, callback) {

        // console.log("markAttendance().imageString : " + imageBase64String);
        const base64text = imageBase64String;//Base64 encoded string

        const base64data = base64text.replace('data:image/jpeg;base64', '');//Strip image type prefix

        if (!fs.existsSync(config.attendanceImagePath)) {

            fs.writeFile(config.attendanceImagePath, base64data, "base64", function (err) {
                if (err) {
                    console.log("markAttendance()" + err); // writes out file without error, but it's not a valid image
                    callback(err, null, null, null);
                } else {

                    request(config.pythonRestUrl, function (error, response, body) {
                        console.log('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log('body:', body); // Print the HTML for the Google homepage.
                        let jsonData = JSON.parse(body);
                        console.log('jsonData.name:', jsonData.name);
                        User.findOne({ username: jsonData.name }, function (err, user) {
                            if (err) {
                                console.log("attendanceController_aj().error :" + err);
                                callback(err, null, null, null);
                            }

                            if (!user) {
                                //User not found
                                console.log("attendanceController_aj().error : User not found!");
                                callback("attendanceController_aj().error : User not found!", null, null, null);

                            } else {
                                var usertype = user.usertype;
                                var username = user.username;
                                callback(null, username, usertype, user._id);


                            }

                        });

                        console.log('Python script executed.');

                    })
                }
            });
        } else {

            fs.unlink(config.attendanceImagePath, function (error) {
                if (error) {
                    callback(error, null, null, null);
                }
                console.log('Deleted test.jpg!!');

                fs.writeFile(config.attendanceImagePath, base64data, "base64", function (err) {
                    if (err) {
                        console.log("markAttendance()" + err); // writes out file without error, but it's not a valid image
                        callback(err, null, null, null);
                    } else {

                        request(config.pythonRestUrl, function (error, response, body) {
                            if (error) {
                                console.log('"markAttendance().request().error: ', error);
                                callback("markAttendance().request().error", null, null, null);
                            }
                            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                            console.log('body:', body); // Print the HTML for the Google homepage.

                            if (body.startsWith("{")) {
                                let jsonData = JSON.parse(body);

                                console.log('jsonData.name:', jsonData.name);

                                if (jsonData.name === "error") {
                                    console.log("Error: Image Corrupted or Null");
                                    callback("Error: Image Corrupted or Null", null, null, null);
                                }

                                User.findOne({ username: jsonData.name }, function (err, user) {
                                    if (err) {
                                        console.log("attendanceController_aj().error :" + err);
                                        callback(err, null, null, null);
                                    }

                                    if (!user) {
                                        //User not found
                                        console.log("attendanceController_aj().error : User not found!");
                                        callback("attendanceController_aj().error : User not found!", null, null, null);

                                    } else {

                                        var usertype = user.usertype;
                                        var username = user.username;

                                        var status = 'Present';
                                        var attendance = new Attendance({ username, usertype, status });

                                        attendance.save(function (err, attendance) {
                                            if (err) {
                                                callback(err, null);
                                                return;
                                            }
                                        });

                                        callback(null, "success");
                                    }

                                });
                            } else {
                                console.log('Face not detected. Python script error! Try again!');
                                callback("Face not detected", null, null, null);
                            }

                            console.log('Python script executed.');

                        })
                    }
                });
            });


        }


    }

};