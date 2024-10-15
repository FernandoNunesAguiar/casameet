const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/base');
const path = require('path');
const { generateCode, sendEmail } = require('../utils/emailService');
const { armazenarCodigo, verificarCodigo } = require('../utils/codigoverificar');

router.post('/login', async (req, res) => {
    const { loginemail, loginsenha, twoFactorCode } = req.body;
    console.log('dados recebidos:', { loginemail, loginsenha, twoFactorCode });

    try {
        console.log('tentando conectar ao banco de dados...');
        const [results] = await db.query('SELECT * FROM usuario WHERE email = ?', [loginemail]);
        console.log('sucesso, resposta:', results);
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'usuário não encontrado.' });
        }
        
        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(loginsenha, usuario.senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'senha incorreta.' });
        }

        if (usuario.duas_etapas) {
            if (!twoFactorCode) {
                const code = generateCode();
                try {
                    await sendEmail(usuario.email, code);
                    await armazenarCodigo(usuario.id, code);
                    return res.status(200).json({ requireTwoFactor: true, message: 'Código de duas etapas enviado para o seu email.' });
                } catch (error) {
                    console.error('Erro ao enviar e-mail:', error);
                    return res.status(500).json({ error: 'Erro ao enviar o código de verificação' });
                }
            } else {
                const isCodeValid = await verificarCodigo(usuario.id, twoFactorCode);
                if (!isCodeValid) {
                    return res.status(401).json({ error: 'Código de duas etapas inválido ou expirado.' });
                }
            }
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.usuario_usuario, email: usuario.email },
            'chave_secreta',
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.json({ success: true });
    } catch (error) {
        console.error('erro detalhado:', error);
        return res.status(500).json({ error: 'erro interno do servidor', details: error.message });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

module.exports = router;