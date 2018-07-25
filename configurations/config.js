const config = {};

config.serverPort = 5000;
config.databaseUrl = 'mongodb://127.0.0.1:27017/LectureCapturingSystemDb';

//Face Recognition Configs
config.JWTSECRET = 'rogueowlseverywhere';
config.imageCopyPath = './public/allImages/';
config.pythonRestUrl = 'http://127.0.0.1:5003/postdata';
config.testPath = './controllers/opencv-face-recognition-python/test-data/test.jpg';
config.imagesTrainingPath = './controllers/opencv-face-recognition-python/training-data/s';

module.exports = config;
