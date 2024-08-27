const express = require('express');
const router = express.Router();
const path = require('path');

// ref tutorial 19:45
// this class is where we handle server-side routing.

// GET Requests for '/' (root), '/index', or '/index.html'
router.get('^/$|/index(.html)?', (req, res) => {

    // send back the file for the request in the result obj.
    // path is cur dir -> up one level -> views/index.html. 
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
});

module.exports = router