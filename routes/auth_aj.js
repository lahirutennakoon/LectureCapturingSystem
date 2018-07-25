var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController_aj')

router.post('/faceLogin', function(req, res, next) {
    authController.getFaceRecStatus(req.body.imageString, function(err, result,username,usertype){
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
                data: {tokenID: result, username: username, usertype: usertype}
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.post('/:username', function(req, res, next) {
    authController.login(req.body.username, req.body.password, function(err, result,usertype){
        if(err){
            console.log(err);
            res.status(500).json({
                success: 0,
                error: err
            })
            return;
        }

        if(result){

            // console.log("authController().login().result :" + usertype);
            res.status(200).json({
                success: 1,
                data: {tokenID: result, username: req.body.username, usertype: usertype}
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