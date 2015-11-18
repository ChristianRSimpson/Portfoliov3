//File Name: about.js
//Author: Christian SImpson
//Web Site name: christianSimpson.azurewebsites.net
//this is the route that points to the correct ejs template for about when sabout is clicked on
var express = require('express');
var express = require('express');
var router = express.Router();

/* get home page. */
router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'about',
        displayName: req.user ? req.user.displayName : ''
    });
});


module.exports = router;
