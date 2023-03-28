const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();
const db = require('../db/connection');
const { render } = require('jade');

const upload = multer({ dest: 'uploads/' })

router.get('/registerPost', function(req, res, next) {
    res.render('registerPost', {title: 'Registro de Usuario'});
});

router.post('/register', upload.single('photo'), async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.registerUser(username, hashedPassword).then((rowCount) => {
        console.log(`${rowCount} filas afectadas.`);
        res.json({msg: "usuario registrado exitosamente"});
    }).catch((err) => {
        console.error(`Error al registrar usuario: ${err}`);
    });
    //req.session.userId = user.id;
});

router.get('/loginPost', function(req, res, next) {
    res.render('loginPost', {title: 'Acceso de Usuario'});
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.getUser(username)
    .then(user => {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.error(err);
            } else if (result) {
              console.log("Acceso de usuario exitosos");
            } else {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        });
        
        let token = jwt.sign({
            name: username
        }, "xyz")
        req.session.token=token;
        res.render('loginPost')
    }).catch(err => {
        console.error(err);
    });   
});

router.get('/me', (req, res) => {
const userId = req.session.userId;
if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
}
const user = users.find(u => u.id === userId);
if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
}
res.json(user);
});

module.exports = router;