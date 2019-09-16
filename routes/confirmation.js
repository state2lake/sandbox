var express = require('express');
var router = express.Router();

/* GET confirmation page. */
router.get('/', function(req, res){
    res.render('confirmation', {
        title: 'Book a Lesson'
    });
});

module.exports = router;