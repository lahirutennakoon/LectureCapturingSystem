const config = {};

config.serverPort = 5000;
//<<<<<<< Ashen_face_recognition
//config.databaseUrl = 'mongodb://127.0.0.1:27017/LectureCapturingSystemDb';
config.databaseUrl = 'mongodb://localhost:27017/LectureCapturingSystemDb';
config.videoSavingPath = '../LectureSystemClient/public/videos/';
config.JWTSECRET = 'rogueowlseverywhere';

module.exports = config;
