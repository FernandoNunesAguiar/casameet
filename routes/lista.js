const express = require('express');
const router = express.Router();
const db = require('../database/base');
const geoip = require('geoip-lite');

// função para calcular a distância entre dois pontos (fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // raio da terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // distancia em km
}

router.get('/lista-imovel', async (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const geo = geoip.lookup(ip);
        console.log('IP:', ip);
        console.log('Geo:', geo);

        const userLat = geo ? geo.ll[0] : -23.5505;
        const userLon = geo ? geo.ll[1] : -46.6333;
        console.log('User location:', userLat, userLon);

        const [imoveis] = await db.query('SELECT id_imovel, nome_imovel, cep, latitude, longitude FROM imovel');
        console.log('Imóveis encontrados:', imoveis.length);

        const imoveisComDistancia = imoveis.map(imovel => ({
            ...imovel,
            imagemUrl: `/imagem-imovel/${imovel.id_imovel}`,
            distancia: calculateDistance(userLat, userLon, imovel.latitude, imovel.longitude)
        }));

        imoveisComDistancia.sort((a, b) => a.distancia - b.distancia);
        const imoveisOrdenados = imoveisComDistancia.map(({ distancia, ...imovel }) => imovel);
        
        console.log('imóveis ordenados:', imoveisOrdenados);
        res.json(imoveisOrdenados);
    } catch (error) {
        console.error('erro ao buscar imóveis:', error);
        res.status(500).json({ error: 'erro ao carregar a lista de imóveis' });
    }
});


router.get('/imagem-imovel/:id', async (req, res) => {
    try {
        const [imovel] = await db.query('SELECT imagem FROM imovel WHERE id_imovel = ?', [req.params.id]);
        if (imovel && imovel[0] && imovel[0].imagem) {
            res.contentType('image/jpeg');
            res.send(imovel[0].imagem);
        } else {
            res.status(404).send('imagem não encontrada');
        }
    } catch (error) {
        console.error('erro ao buscar imagem:', error);
        res.status(500).send('erro ao carregar a imagem');
    }
});

router.get('/listar-imoveis', (req, res) => {
    res.render('listar/lista_imoveis');
});

router.get('/imovel/:id', async (req, res) => {
    try {
        const [imovel] = await db.query('SELECT * FROM imovel WHERE id_imovel = ?', [req.params.id]);
        if (imovel && imovel[0]) {
            res.render('imovel/detalhes', { imovel: imovel[0] });
        } else {
            res.status(404).send('Imóvel não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do imóvel:', error);
        res.status(500).send('Erro ao carregar os detalhes do imóvel');
    }
});

module.exports = router;