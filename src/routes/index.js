var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({msg: "Hola Mundo"});
});

module.exports = router;