//Import libraries
const express        = require('express');
const bodyParser     = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Import configuration file
const config = require('./configurations/config');

// Import the routes file
const routes = require('./routes/routes');

const server = express();
const serverPort = config.serverPort;
const databaseUrl = config.databaseUrl;

server.use(cors);
server.use(fileUpload());
server.use(routes);

// Connect to mongodb database
mongoose.connect(databaseUrl);


//Start the server
server.listen(serverPort, err => {
    if (err)
    {
        console.error(err);
        return;
    }
    console.log('Server listening on port: ' + serverPort);
});