const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateCode() {
    return crypto.randomInt(100000, 999999).toString();
}

async function sendEmail(to, code) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu Código de Verificação</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 20px;
            }
            h1 {
                color: #0066cc;
            }
            .code {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto;
              width: fit-content;
              gap: 20px;
            }
            .code div {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 5px;
            font-size: 20px;
            font-weight: bold;
            }
            .quadrado {
            display: flex;
            gap: 5px;
            }
        </style>
    </head>
    <body>
    <center>
        <div class="container">
            <h1>Seu Código de Verificação</h1>
            <p>Olá,</p>
            <p>Seu código de verificação é:</p>
            <div class="code">
            ${code.split('').map(codigo_separado => `<div>${codigo_separado}</div>`).join('')}
            </div>
            </div>
            <p>Este código expirará em 10 minutos.</p>
            <p>Se você não solicitou este código, por favor ignore este e-mail.</p>
        </div>
    </center>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'Seu código de verificação',
        text: `Seu código de verificação é: ${code}`,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
    }
}

async function sendDenunciaConfirmationEmail(to, descricao) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Denúncia</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 20px;
            }
            h1 {
                color: #0066cc;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Confirmação de Denúncia</h1>
            <p>Olá,</p>
            <p>Recebemos sua denúncia e já estamos analisando. Entraremos em contato em breve com mais informações.</p>
            <p>Descrição da denúncia:</p>
            <p><em>${descricao}</em></p>
            <p>Obrigado por nos ajudar a manter nossa comunidade segura.</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'Confirmação de Denúncia',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de confirmação de denúncia enviado com sucesso');
    } catch (error) {
        console.error('Erro ao enviar e-mail de confirmação de denúncia:', error);
        throw error;
    }
}

module.exports = { generateCode, sendEmail, sendDenunciaConfirmationEmail };