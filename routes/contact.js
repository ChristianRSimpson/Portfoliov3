//File Name: contact.js
//Author: Christian SImpson
//Web Site name: christianSimpson.azurewebsites.net
//this is the route that points to the correct ejs template for contact when contact is clicked on
var express = require('express');
var express = require('express');
var router = express.Router();

/* Render home page. */
router.get('/contact', function (req, res, next) {
    res.render('contact', {
        title: 'contact',
        displayName: req.user ? req.user.displayName : ''
    });
});

module.exports = router;
