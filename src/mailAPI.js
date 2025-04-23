const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const base64Img = require('base64-img');

app.post('/sendEmail', async (req, res) => {
    const { percent, imageDataUrl } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'aerithservice@outlook.com',
            pass: 'SmartCamera',
        },
    });

    let imageAttachment = base64Img.imgSync(imageDataUrl, '.', 'screenshot');

    let currentDate = new Date().toLocaleDateString();

    let mailOptions = {
        from: 'aerithservice@outlook.com',
        to: 'stefan04.neubauer@gmail.com',
        subject: `Überfall erkannt [${currentDate}]`,
        text: `Sehr geehrter Aerith-Kunde,

        Ihre Software Aerith Security hat einen Überfall am [${currentDate}] erkannt.
        Die Übereinstimmungsquote liegt bei ${percent}%. 

        Ein Screenshot des (möglichen) Überfalls befindet sich im Anhang.

        Wenn es sich um einen Fehlalarm handelt, können Sie diese Nachricht ignorieren.`,

        attachments: [
            {
                filename: 'screenshot.png',
                path: imageAttachment,
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);
        res.status(200).send('Email sent');
        fs.unlinkSync(imageAttachment); // Löscht das temporäre Bild
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }    
});

app.listen(3001, () => {
    console.log('Mail API listening on port 3001');
});
