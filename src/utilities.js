// Array aus dem Überfall-Label. 
// Leicht erweiterbar.
const labelMap = {
    1: { name: 'guns' },
    2: { name: 'gun' }
}

// Funktion, die Rechtecke zeichnet im Bild
export const drawRect = (detections, ctx, canvasRef, webcamRef) => {

    detections.forEach((row) => {
        if (true) {
            var temp = row.bbox;
            temp.class = row.class;
            temp.color = row.color;
            temp.confidence = row.confidence;
            row = temp;
        }

        // Muss über 90% zutreffen
        if (row.confidence < 0.8) return;

        let percent = row.confidence * 100;

        // E-Mail versenden
        const imageDataUrl = captureScreenshot(webcamRef, canvasRef);
        sendEmail(percent, imageDataUrl);


        // Variablen extrahieren
        var x = row.x - (row.width) / 2;
        var y = row.y - (row.height) / 2;
        var w = row.width;
        var h = row.height;

        // Stil festlegen
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = row.color;
        var radius = 5;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(x, y, w, h);

        // Text festlegen
        var fontColor = "white";
        var fontSize = 14;
        var classTxt = row.class;
        var confTxt = (row.confidence * 100).toFixed().toString() + "%";
        var msgTxt = classTxt + " " + confTxt;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textBaseline = "top";
        ctx.fillStyle = fontColor;
        var textWidth = ctx.measureText(msgTxt).width;

        if (textWidth <= w) {
            ctx.fillRect(x, y - fontSize, textWidth + 5, fontSize + 5);
            ctx.fillStyle = row.color;
            ctx.fillText(msgTxt, x + 2, y - fontSize + 2);
        } else {
            ctx.fillRect(x, y - fontSize, w, fontSize + 5);
            ctx.fillStyle = row.color;
            ctx.fillText(confTxt, x + 2, y - fontSize + 2);
        }
    });
}



// Methode für das Senden der E-Mail mit API Zugriff
const sendEmail = async (percent, imageDataUrl) => {
    try {
        const response = await fetch('http://localhost:3001/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ percent, imageDataUrl }),
        });

        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Error sending email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const captureScreenshot = (webcamRef, canvasRef) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasRef.current.width;
    canvas.height = canvasRef.current.height;
    const ctx = canvas.getContext('2d');

    // Zeichne das Video auf das neue Canvas
    ctx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);

    // Zeichne die Rechtecke aus dem vorhandenen Canvas auf das neue Canvas
    ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
};





