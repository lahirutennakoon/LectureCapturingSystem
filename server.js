//Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const server = express();

//SOCKET.IO
var http = require('http').Server(server);
var io = require('socket.io')(http);

const cors = require('cors');
const authCheckMiddleware = require('./middleware/authCheck_aj');
var authRoute = require('./routes/auth_aj');

// Import configuration file
const config = require('./configurations/config');

// Import the routes file
const routes = require('./routes/routes');

var visitorsData = {};

const serverPort = config.serverPort;
const databaseUrl = config.databaseUrl;

server.use(cors());
server.use(fileUpload());
server.use(routes);
server.use(express.static('public/allImages'));
server.use(cors());
server.options('*', cors());

// Connect to mongodb database
mongoose.connect(databaseUrl, function (err) {
    if (err) {
        console.log('Error connecting to: ' + databaseUrl)
    }
    else {
        console.log('Connected to: ' + databaseUrl)
    }
});

var db = mongoose.connection;

server.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

server.use('/user', authRoute);

io.on('connection', function (socket) {
    setInterval(() => {
        io.emit('updated-stats', computeStats());
    }, 3000);
    socket.on('visitor-data', function (data) {
        visitorsData[socket.id] = data;
        io.emit('updated-stats', computeStats());
    })
    socket.on('disconnect', function () {
        delete visitorsData[socket.id];
        io.emit('updated-stats', computeStats());
    });
});

function computeStats() {
    var temp = {
        pages: computePageCounts(),
        referrers: computeRefererCounts(),
        activeUsers: getActiveUsers()
    };
    return temp;
}

function computePageCounts() {
    var pageCounts = {};
    for (var key in visitorsData) {
        var page = visitorsData[key].page;
        if (page in pageCounts) {
            pageCounts[page]++;
        } else {
            pageCounts[page] = 1;
        }
    }
    return pageCounts;
}

function computeRefererCounts() {
    var referrerCounts = {};
    for (var key in visitorsData) {
        var referringSite = visitorsData[key].referringSite || '(direct)';
        if (referringSite in referrerCounts) {
            referrerCounts[referringSite]++;
        } else {
            referrerCounts[referringSite] = 1;
        }
    }
    return referrerCounts;
}

function getActiveUsers() {
    return Object.keys(visitorsData).length;
}

//Start the server
http.listen(serverPort, err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Server listening on port: ' + serverPort);
});

