const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const app = express();

const cadastroRoutes = require('./routes/cadastro');
const criarImovelRoutes = require('./routes/criarimovel');
const duasEtapasRoutes = require('./routes/duas_etapas');
const listaRoutes = require('./routes/lista');
const loginRoutes = require('./routes/login');
const editarRoutes = require('./routes/editar');
const denunciarRoutes = require('./routes/denuncia');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(session({
    secret: 'chave_secreta',
    resave: false,
    saveUninitialized: true
}));


app.use('/', cadastroRoutes);
app.use('/', criarImovelRoutes);
app.use('/', duasEtapasRoutes);
app.use('/', listaRoutes);
app.use('/', loginRoutes);
app.use('/', editarRoutes);
app.use('/', denunciarRoutes);
app.use('/api', editarRoutes);
app.use('/middlewares', express.static('middlewares'));
app.use('/scripts', express.static(path.join(__dirname, 'middlewares')));


app.get('/', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.render('home', { usuario: null });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta');
        const usuario = { id: decoded.id, nome: decoded.nome, email: decoded.email };
        res.render('home', { usuario });
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        res.clearCookie('token');
        res.render('home', { usuario: null });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

