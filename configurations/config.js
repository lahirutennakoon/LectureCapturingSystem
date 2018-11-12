const config = {};

config.serverPort = 5000;
config.databaseUrl = 'mongodb://127.0.0.1:27017/LectureCapturingSystemDb';
config.videoSavingPath = '../LectureSystemClient/public/videos/';
config.ffmpegPath = 'C:/Required/ffmpeg_old/bin/ffmpeg.exe';

//Face Recognition Configs
config.JWTSECRET = 'rogueowlseverywhere';
config.imageCopyPath = './public/allImages/';
config.pythonLoginUrl = 'http://127.0.0.1:5004/loginAfterFeed';
config.pythonRestUrl = 'http://127.0.0.1:5003/postdata';
config.testPath = './opencv-face-recognition-python/test-data/test.jpg';
config.imagesTrainingPath = './opencv-face-recognition-python/training-data/s';
config.pythonTrainImagesUrl = 'http://127.0.0.1:5003/train';
config.attendanceImagePath = './public/attendanceImages/test.jpg';
config.bandPath = './public/video/sample.mp4';
config.attendancePythonUrl = 'http://localhost:5004/cam_Release';

// Bluemix Watson speech to text
config.bluemixSpeechToTextUrl = "https://stream.watsonplatform.net/speech-to-text/api";
config.bluemixSpeechToTextUsername = 'c70e62af-7ac6-4b2b-8c03-2c29c90bca0a';
config.bluemixSpeechToTextPassword = 'ZsN5o7UPmqQi';

module.exports = config;
