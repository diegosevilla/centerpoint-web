// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//json parser
app.use(bodyParser.json())
// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'react-ui/build')))
// Serve our api
app.set('trust proxy', 1) // trust first proxy

app.use('/api', require('./api'))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'react-ui/build', 'index.html'));
});



module.exports = app;
