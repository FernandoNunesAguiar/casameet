const db = require('../database/base');

async function armazenarCodigo(userId, code) {
    const expirar = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos de validade
    await db.query('INSERT INTO verificar_email (usuario_id, codigo, expirar) VALUES (?, ?, ?)', [userId, code, expirar]);
}

async function verificarCodigo(userId, code) {
    const [results] = await db.query('SELECT * FROM verificar_email WHERE usuario_id = ? AND codigo = ? AND expirar > NOW()', [userId, code]);
    if (results.length > 0) {
        await db.query('DELETE FROM verificar_email WHERE usuario_id = ?', [userId]);
        return true;
    }
    return false;
}

module.exports = { armazenarCodigo, verificarCodigo };