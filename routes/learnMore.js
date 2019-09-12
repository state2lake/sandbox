var express = require('express');
var router = express.Router();

/* GET learnMore page. */
router.get('/', function(req, res){
    res.render('learnMore', {
        title: 'Book a Lesson'
    });
});

module.exports = router;