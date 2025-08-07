const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());

app.post('/api/enviar-excel', upload.single('file'), async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Formulario Web" <${process.env.EMAIL_USER}>`,
            to: 'mhmdmstf17@gmail.com',
            subject: 'Nueva inscripción recibida',
            text: 'Se adjunta el archivo con los datos de inscripción.',
            attachments: [{
                filename: 'inscripcion.xlsx',
                path: req.file.path
            }]
        });

        fs.unlinkSync(req.file.path);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al enviar el correo.' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
