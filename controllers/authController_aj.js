
var jwt = require('jsonwebtoken');
const config = require('../configurations/config');
var User = require('../models/authentication/User_aj')
var backupUsers = require('../models/authentication/password_aj')
const fs = require('fs');
const PythonShell = require('python-shell');

module.exports = {

    login: function(username, password, callback){

        User.findOne({ username: username }, function(err, user) {
            if(err){
                callback(err, null);
                return;
            }

            if(!user){
                //User not found
                callback(err, null);
            }else{
                user.comparePassword(password, function(err, isMatch) {
                    if(err){
                        callback(err, null);
                        return
                    }

                    if(isMatch){
                        var authToken = jwt.sign({ username: user.username, _id: user._id}, config.JWTSECRET);
                        var usertype = user.usertype;
                        callback(null, authToken,usertype);
                    }else{
                        callback(err, null);
                    }
                });

            };

        });
    },
    register: function(username, password, usertype, callback){

        console.log("authController().register()");

        var newUser = new User({username,password,usertype});
        var password_aj = new backupUsers({username,password,usertype});

        password_aj.save(function(err, passuser) {
            if(err){
                console.log("password_aj error when saving to db");
                callback(err, null);
                return;
            }
        });

        newUser.save(function(err, user) {
            if(err){
                callback(err, null);
                return;
            }

            var authToken = jwt.sign({ username: user.username, _id: user._id},config.JWTSECRET);
            callback(null, authToken);
        });
    },

    getAllUsers: function(callback){
        backupUsers.find({}, function(err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        });
    },

    getFaceRecStatus: function(imageBase64String, callback){
       // console.log("getFaceRecStatus().imageString : " + imageBase64String);

        const base64text=imageBase64String;//Base64 encoded string

        const base64data =base64text.replace('data:image/jpeg;base64','');//Strip image type prefix

        fs.writeFile('./controllers/opencv-face-recognition-python/test-data/test.jpg', base64data, "base64", function(err) {
            if (err){
                console.log("getFaceRecStatus()"+err); // writes out file without error, but it's not a valid image
                callback(err, null);
            } else{
                callback(null, "Server().Image Saved");
                const options = {
                    mode: 'text',
                    // pythonPath: '',
                    pythonOptions: ['-u'], // get print results in real-time
                    scriptPath: './controllers/opencv-face-recognition-python/',
                    // args: ['value1', 'value2']
                };

                // PythonShell.run('OpenCV-Face-Recognition-Python.py',options,function (err, results) {
                //     if (err){
                //         console.log("Server.PythonShell.error :" + err);
                //         // callback(err, null);
                //     }else{
                //         console.log("Server.PythonShell.success :" + results);
                //     }
                // });

                const pyshell = new PythonShell('./controllers/opencv-face-recognition-python/OpenCV-Face-Recognition-Python.py');

                pyshell.on('label_text', function (message) {
                    // received a message sent from the Python script (a simple "print" statement)
                    console.log("Server.PythonShell :" + message.toString());
                });

                pyshell.end(function (err,code,signal) {

                    if (err) throw err;
                    console.log('The exit code was: ' + code);
                    console.log('The exit signal was: ' + signal);
                    console.log('finished');
                    console.log('finished');
                });


                console.log('Python script executed.');

            }
        });

    },

};