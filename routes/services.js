//File Name: services.js
//Author: Christian SImpson
//Web Site name: christianSimpson.azurewebsites.net
//this is the route tha points to the correct ejs template for services when services is clicked on
var express = require('express');
var router = express.Router();

/* Render servives page. */
router.get('/services', function (req, res, next) 
{
    res.render('services', 
    {
        title: 'services',
        displayName: req.user ? req.user.displayName : ''
    });
});

module.exports = router;
