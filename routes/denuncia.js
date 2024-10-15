const express = require('express');
const router = express.Router();
const db = require('../database/base');
const { authenticateToken } = require('../middlewares/auth');
const { sendDenunciaConfirmationEmail } = require('../utils/emailService'); 


router.get('/denuncia', authenticateToken, async (req, res) => {
    try {
        const [denuncias] = await db.query('SELECT * FROM denuncia ORDER BY datadenuncia DESC');
        res.render('denuncia/denuncia', { denuncias });
    } catch (error) {
        console.error('erro ao buscar denúncias:', error);
        res.status(500).send('erro ao carregar denúncias');
    }
});


router.get('/report', authenticateToken, async (req, res) => {
    res.render('denuncia/report');
});


router.post('/report', authenticateToken, async (req, res) => {
    const { descricao, categoria, id_imovel } = req.body;
    const usuario_email = req.user.email;
    const datadenuncia = new Date().toISOString().slice(0, 10);

    try {
        
        let fk_id_imovel = null;
        if (id_imovel) {
            const [imovel] = await db.query('SELECT id_imovel FROM imovel WHERE id_imovel = ?', [id_imovel]);
            if (imovel.length > 0) {
                fk_id_imovel = id_imovel;
            }
        }

        await db.query(
            'INSERT INTO denuncia (descricao, categoria, usuario_email, datadenuncia, fk_id_usuario, fk_id_imovel) VALUES (?, ?, ?, ?, ?, ?)',
            [descricao, categoria, usuario_email, datadenuncia, req.user.id, fk_id_imovel]
        );

       
        await sendDenunciaConfirmationEmail(usuario_email, descricao);
        
        res.redirect('/?success=denuncia');
    } catch (error) {
        console.error('erro ao enviar denúncia:', error);
        res.redirect('/report?error=true');
    }
});

router.get('/denuncia/:id', authenticateToken, async (req, res) => {
    try {
        const [denuncia] = await db.query('SELECT * FROM denuncia WHERE id = ?', [req.params.id]);
        if (denuncia.length === 0) {
            return res.status(404).send('denúncia não encontrada');
        }
        res.render('denuncia/denuncia-detalhes', { denuncia: denuncia[0] });
    } catch (error) {
        console.error('erro ao buscar detalhes da denúncia:', error);
        res.status(500).send('erro ao carregar detalhes da denúncia');
    }
});

module.exports = router;