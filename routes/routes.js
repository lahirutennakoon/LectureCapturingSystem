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



module.exports = router;