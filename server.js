//Import libraries
const express        = require('express');
const bodyParser     = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const authCheckMiddleware = require('./middleware/authCheck_aj');
var authRoute = require('./routes/auth_aj');

// Import configuration file
const config = require('./configurations/config');

// Import the routes file
const routes = require('./routes/routes');

const server = express();
const serverPort = config.serverPort;
const databaseUrl = config.databaseUrl;

server.use(routes);
server.use(express.static('public/allImages'));
server.use(cors());
server.options('*', cors());

// Connect to mongodb database
mongoose.connect(databaseUrl, function(err){
    if(err){
        console.log('Error connecting to: '+ databaseUrl)
    }
    else{
        console.log('Connected to: '+ databaseUrl)
    }
})

server.use('/user', authRoute);

//Start the server
server.listen(serverPort, err => {
    if (err)
    {
        console.error(err);
        return;
    }
    console.log('Server listening on port: ' + serverPort);
});