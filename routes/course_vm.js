var express = require('express');
var router = express.Router();
var courseController = require('../controllers/courseController_vm');
const config = require('../configurations/config');
var request = require('request');

//add new course
router.post('/addCourse', function(req, res) {
    courseController.addCourse(req.body.coursename,
        req.body.duration, req.body.modulecode, req.body.credits, function(err, result){
            if(err){
                console.log(err);
                res.status(500).json({
                    success: 0,
                    error: err
                });
                return;
            }
            if(result){
                res.status(200).json({
                    success: 1,
                });
            }else{
                res.status(401).json({
                    success: 0
                });
            }
        });
});

router.post('/delete', function(req, res, next) {
    courseController.deleteCourse(req.body.courseID,function(err, result){
        if(err){
            res.status(500).json({
                success: 0,
                error: err
            });
            return;
        }
        if(result){
            res.status(200).json({
                success: 1,
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.post('/updateCourse', function(req, res) {
    courseController.updateCourse(req.body.coursename,
        req.body.duration, req.body.modulecode, req.body.credits, req.body._id, function(err, result){
        if(err){
            res.status(500).json({
                success: 0,
                error: err
            });
            return;
        }
        if(result){
            res.status(200).json({
                success: 1,
            });
        }else{
            res.status(401).json({
                success: 0,
                data: result
            });
        }
    });

});

router.get('/getAllCourses', function(req, res, next) {
    courseController.getAllCourses(function(err, result){
        if(err){
            res.status(500).json({
                success: 0,
                error: err
            });
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

module.exports = router;