const config = {};

config.serverPort = 5000;
config.databaseUrl = 'mongodb://localhost:27017/LectureCapturingSystemDb';
config.videoSavingPath = '../LectureSystemClient/public/videos/';
config.JWTSECRET = 'rogueowlseverywhere';

module.exports = config;
