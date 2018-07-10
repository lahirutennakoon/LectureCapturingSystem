const config = {};

config.serverPort = 5000;
//<<<<<<< Ashen_face_recognition
//config.databaseUrl = 'mongodb://127.0.0.1:27017/LectureCapturingSystemDb';
config.databaseUrl = 'mongodb://localhost:27017/LectureCapturingSystemDb';
config.videoSavingPath = '../LectureSystemClient/public/videos/';
config.ffmpegPath = 'F:/Program Files/ffmpeg-20180706-cced03d-win64-static/bin/ffmpeg.exe';

config.JWTSECRET = 'rogueowlseverywhere';

// Bluemix Watson speech to text
config.bluemixSpeechToTextUrl = "https://stream.watsonplatform.net/speech-to-text/api";
config.bluemixSpeechToTextUsername = 'c70e62af-7ac6-4b2b-8c03-2c29c90bca0a';
config.bluemixSpeechToTextPassword = 'ZsN5o7UPmqQi';

module.exports = config;
