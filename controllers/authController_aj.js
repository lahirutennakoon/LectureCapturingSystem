
var jwt = require('jsonwebtoken');
const config = require('../configurations/config');
var User = require('../models/authentication/User_aj')
var backupUsers = require('../models/authentication/password_aj')
var User = require('../models/authentication/User_aj')
const fs = require('fs');
const PythonShell = require('python-shell');
var request = require('request');

module.exports = {

    login: function (username, password, callback) {

        User.findOne({ username: username }, function (err, user) {
            if (err) {
                callback(err, null);
                return;
            }

            if (!user) {
                //User not found
                callback(err, null);
            } else {
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        callback(err, null);
                        return
                    }

                    if (isMatch) {
                        var authToken = jwt.sign({ username: user.username, _id: user._id }, config.JWTSECRET);
                        var usertype = user.usertype;
                        callback(null, authToken, usertype);
                    } else {
                        callback(err, null);
                    }
                });

            }

        });
    },
    register: function (username, password, usertype, images, callback) {

        console.log("authController().register()");

        var newUser = new User({ username, password, usertype, images });
        // var password_aj = new backupUsers({username,password,usertype,images});

        // password_aj.save(function(err, passuser) {
        //     if(err){
        //         console.log("password_aj error when saving to db");
        //         callback(err, null);
        //         return;
        //     }
        // });

        newUser.save(function (err, user) {
            if (err) {
                callback(err, null);
                return;
            }

            let userlength = 0;

            var authToken = jwt.sign({ username: user.username, _id: user._id }, config.JWTSECRET);
            callback(null, authToken);

            User.find().count({}, function (err, data) {
                if (err) {
                    console.log("users.find.error : " + err);
                }
                console.log("UserTable Length :" + data);

                userlength = parseInt(data) - 1;
                console.log("User directory : " + userlength);
                var dir = config.imagesTrainingPath + userlength;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);

                    if (fs.existsSync(dir)) {
                        images.map(f =>
                            fs.copyFileSync(config.imageCopyPath + f, dir + "/" + f, function (err, data) {
                                if (err) {
                                    console.log("copyFileSync().error : " + err);
                                }
                            })
                        );
                    }
                }
            });
        });
    },

    getAllUsers: function (callback) {
        User.find({}, function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        });
    },

    getFaceRecStatus: function (imageBase64String, callback) {

        // console.log("getFaceRecStatus().imageString : " + imageBase64String);
        const base64text = imageBase64String;//Base64 encoded string

        const base64data = base64text.replace('data:image/jpeg;base64', '');//Strip image type prefix

        if (!fs.existsSync(config.testPath)) {

            fs.writeFile(config.testPath, base64data, "base64", function (err) {
                if (err) {
                    console.log("getFaceRecStatus()" + err); // writes out file without error, but it's not a valid image
                    callback(err, null);
                } else {

                    request(config.pythonRestUrl, function (error, response, body) {
                        console.log('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log('body:', body); // Print the HTML for the Google homepage.
                        let jsonData = JSON.parse(body);
                        console.log('jsonData.name:', jsonData.name);
                        User.findOne({ username: jsonData.name }, function (err, user) {
                            if (err) {
                                console.log("authController_aj().error :" + err);
                                callback(err, null, null, null);
                            }

                            if (!user) {
                                //User not found
                                console.log("authController_aj().error : User not found!");
                                callback("authController_aj().error : User not found!", null, null, null);

                            } else {

                                var authToken = jwt.sign({ username: user.username, _id: user._id }, config.JWTSECRET);
                                var usertype = user.usertype;
                                var username = user.username;
                                callback(null, authToken, username, usertype);
                            }

                        });

                        console.log('Python script executed.');

                    })
                }
            });
        } else {

            fs.unlink(config.testPath, function (error) {
                if (error) {
                    callback(error, null, null, null);
                }
                console.log('Deleted test.jpg!!');

                fs.writeFile(config.testPath, base64data, "base64", function (err) {
                    if (err) {
                        console.log("getFaceRecStatus()" + err); // writes out file without error, but it's not a valid image
                        callback(err, null);
                    } else {

                        request(config.pythonRestUrl, function (error, response, body) {
                            if (error) {
                                console.log('"getFaceRecStatus().request().error: ', error);
                                callback("getFaceRecStatus().request().error: " + err, null, null, null);
                            }
                            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                            console.log('body:', body); // Print the HTML for the Google homepage.
                            let jsonData = JSON.parse(body);
                            console.log('jsonData.name:', jsonData.name);

                            if (jsonData.name === "error") {
                                callback("Error: Image Corrupted or Null", null, null, null);
                            }

                            User.findOne({ username: jsonData.name }, function (err, user) {
                                if (err) {
                                    console.log("authController_aj().error :" + err);
                                    callback(err, null, null, null);
                                }

                                if (!user) {
                                    //User not found
                                    console.log("authController_aj().error : User not found!");
                                    callback("authController_aj().error : User not found!", null, null, null);

                                } else {

                                    var authToken = jwt.sign({ username: user.username, _id: user._id }, config.JWTSECRET);
                                    var usertype = user.usertype;
                                    var username = user.username;
                                    callback(null, authToken, username, usertype);
                                }

                            });

                            console.log('Python script executed.');

                        })
                    }
                });
            });


        }


    },

};