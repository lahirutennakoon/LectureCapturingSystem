var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController_aj')
const config = require('../configurations/config');
var request = require('request');


router.get('/loginNew', function(req, res, next) {
    authController.loginNewFunc(function(err, result,username,usertype,userID){
        if(err){
            console.log("Error /loginNew authController.loginNewFunc");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(result){
            //SESSION
            req.session.userId = userID;
            req.session.username = username;

            res.status(200).json({
                success: 1,
                data: {tokenID: result, username: username, usertype: usertype, userid: userID}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.post('/delete', function(req, res, next) {
    authController.deleteUser(req.body.userid,function(err, result){
        if(err){
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(result){

            res.status(200).json({
                success: 1,
                // data: {tokenID: result, username: username, usertype: usertype, userid: userID}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.post('/updateUser', function(req, res, next) {
    authController.updateUser(req.body.username,
        req.body.password, req.body.usertype, req.body.images, req.body._id,function(err, result){
        if(err){
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(result){

            res.status(200).json({
                success: 1,
                // data: {tokenID: result, username: username, usertype: usertype, userid: userID}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

// GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                res.status(500).json({
                    success: 0,
                    error: err
                })
                return;
            } else {
                console.log("Session Destroyed!");
                res.status(200).json({
                    success: 1
                });
            }
        });
    }
});

router.post('/faceLogin', function(req, res, next) {
    authController.getFaceRecStatus(req.body.imageString, function(err, result,username,usertype,userID){
        if(err){
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(result){
            //SESSION
            req.session.userId = userID;
            req.session.username = username;

            res.status(200).json({
                success: 1,
                data: {tokenID: result, username: username, usertype: usertype, userid: userID}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.post('/:username', function (req, res, next) {
    authController.login(req.body.username, req.body.password, function (err, result, usertype, userId) {
        if(err){
            console.log(err);
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }

        if(result){
            //SESSION
            req.session.userId = userId;
            req.session.username = req.body.username;
            // console.log("authController().login().result :" + usertype);
            res.status(200).json({
                success: 1,
                data: {tokenID: result, username: req.body.username, usertype: usertype, userid: userId}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });
});


//register
router.post('/', function(req, res, next) {
    authController.register(req.body.username,
        req.body.password, req.body.usertype, req.body.images, function(err, result){
        if(err){
            console.log(err);
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(result){
            res.status(200).json({
                success: 1,
                data: {tokenID: result, username: req.body.username}
            });

            //train data for face recognition after a registration
            request(config.pythonTrainImagesUrl, function (error, response, body) {
                if (error) {
                    console.log('"faceTrain().Ragister().request().error: ', error);
                }
                console.log("response :"+response && response.statusCode);
                console.log("body :" + body);
            });

        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});


router.get('/getAllUsers', function(req, res, next) {
    authController.getAllUsers(function(err, result){
        if(err){
            // console.log("");
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }
        if(result){
            res.status(200).json({
                success: 1,
                data: {result}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});




module.exports = router