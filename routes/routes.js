//Import Libraries
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// Import controllers
const videoController_lt = require('../controllers/videoController_lt');



// videoController_lt routes
router.post('/api/video', videoController_lt.uploadVideo);
router.get('/api/videos', videoController_lt.getAllVideos);
router.post('/api/videoChapters', videoController_lt.createVideoChapters);
router.get('/api/video', videoController_lt.getOneVideo);

module.exports = router;