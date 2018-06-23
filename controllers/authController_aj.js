var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const config = require('../configurations/config');
var User = require('../models/User_aj')

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

        var newUser = new User({username,password,usertype});

        newUser.save(function(err, user) {
            if(err){
                callback(err, null);
                return;
            }

            var authToken = jwt.sign({ username: user.username, _id: user._id},config.JWTSECRET);
            callback(null, authToken);
        });
    }
}