const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/base');
const path = require('path');


router.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/cadastro.html'));
});

router.post('/cadastro', async (req, res) => {
    const { cadusuario, cademail, cadsenha } = req.body;
    try {
        const senhacript = await bcrypt.hash(cadsenha, 10);
        const sql = 'INSERT INTO usuario (email, usuario_usuario, senha) VALUES (?, ?, ?)';
        db.query(sql, [cademail, cadusuario, senhacript], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.redirect("/login");
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;