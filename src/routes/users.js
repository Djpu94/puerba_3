var express = require('express');
var router = express.Router();
const db = require('../db/connection')

router.get('/', (req, res) => {
    db.listUsers().then(users => {
        console.log('lista de usuarios', users);
        res.render('users', {title: 'Lista de usuarios', usuarios:users})
    }).catch(err => {
        console.error(err);
    });
});

module.exports = router;

