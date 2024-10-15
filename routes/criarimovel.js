console.log('Arquivo criarimovel.js carregado');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database/base');
const { getCoordinatesFromCEP } = require('../utils/geocoder');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });



router.get('/criar-imovel', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/criar-imovel.html'));
});

router.post('/imovelcriado', upload.single('Imagem'), async (req, res) => {
    console.log('recebido pedido para criar imóvel:', req.body);
    try {
        const { NomeImovel, Descricao, Preco, CEP, Categoria } = req.body;
        const Imagem = req.file ? req.file.filename : null;

        
        const coordinates = await getCoordinatesFromCEP(CEP);
        
        if (!coordinates) {
            throw new Error('não foi possível obter as coordenadas para o CEP fornecido');
        }

        const [result] = await db.query(
            'INSERT INTO imovel (nome_imovel, descricao, valor, cep, categoria, imagem, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [NomeImovel, Descricao, Preco, CEP, Categoria, Imagem, coordinates.latitude, coordinates.longitude]
        );

        console.log('Iuóvel criado com sucesso:', result);
        res.redirect('/');  
    } catch (error) {
        console.error('erro detalhado ao criar imóvel:', error);
        res.status(500).send('erro ao criar imóvel: ' + error.message);
    }
});

router.get('/teste-rota', (req, res) => {
    res.send('funcionando');
});

module.exports = router;