const express = require('express');
const router = express.Router();
const db = require('../database/base');
const { authenticateToken } = require('../middlewares/auth');


router.get('/editar', authenticateToken, async (req, res) => {
    res.render('editar/editar');
});


router.post('/buscar-usuario', authenticateToken, async (req, res) => {
    const { usuario_usuario } = req.body;
    try {
    
        const [usuarios] = await db.query('SELECT * FROM usuario WHERE usuario_usuario = ?', [usuario_usuario]);
        
        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            let dadosAdicionais = null;
            
   
            const [donos] = await db.query('SELECT * FROM dono WHERE fk_id_usuario = ?', [usuario.id]);
            if (donos.length > 0) {
                dadosAdicionais = { tipo: 'dono', ...donos[0] };
            } else {
              
                const [clientes] = await db.query('SELECT * FROM clientes WHERE fk_id_usuario = ?', [usuario.id]);
                if (clientes.length > 0) {
                    dadosAdicionais = { tipo: 'cliente', ...clientes[0] };
                }
            }
            
            res.json({ usuario, dadosAdicionais });
        } else {
            res.status(404).json({ error: 'usuário não encontrado' });
        }
    } catch (error) {
        console.error('erro ao buscar usuário:', error);
        res.status(500).json({ error: 'erro ao buscar usuário' });
    }
});


router.post('/buscar-imovel', authenticateToken, async (req, res) => {
    const { id_imovel } = req.body;
    try {
        const [imoveis] = await db.query('SELECT * FROM imovel WHERE id_imovel = ?', [id_imovel]);
        if (imoveis.length > 0) {
            res.json(imoveis[0]);
        } else {
            res.status(404).json({ error: 'imóvel não encontrado' });
        }
    } catch (error) {
        console.error('erro ao buscar imóvel:', error);
        res.status(500).json({ error: 'erro ao buscar imóvel' });
    }
});



module.exports = router;