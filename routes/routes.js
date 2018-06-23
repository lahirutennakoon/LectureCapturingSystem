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


module.exports = router;