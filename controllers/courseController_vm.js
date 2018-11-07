var jwt = require('jsonwebtoken');
const config = require('../configurations/config');
var Course = require('../models/course_vm');
const fs = require('fs');
const PythonShell = require('python-shell');
var request = require('request');

module.exports = {

    addCourse: function (coursename, duration, modulecode, credits, callback) {

        var newCourse = new Course({ coursename, duration, modulecode, credits });

        newCourse.save(function (err, course) {
            if (err) {
                callback(err, null);
                return;
            }
        });
    },

    getAllCourses: function (callback) {
        Course.find({}, function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        });
    },

    updateCourse: function (coursename, duration, modulecode, credits, courseID, callback) {
        Course.findByIdAndUpdate(courseID,
            {
                coursename: coursename,
                duration: duration,
                modulecode: modulecode,
                credits: credits
            },
            function (err, response) {
                if (err) {
                    callback(err, null);
                } else {
                    console.log('course updated!');
                    callback(null, "Updated");
                }
            });
    },

    deleteCourse: function (courseID, callback) {
        Course.findByIdAndRemove(courseID,
            function (err) {
                if (err) {
                    callback(err, null);
                }
                    console.log('course deleted!');
                    callback(null, "Deleted");
            });
    }
};