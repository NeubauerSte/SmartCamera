import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { drawRect } from "./utilities";
import "./App.css";
// React-Bootstrap Einbindung
import { Form, FormControl, Button, Container, Row, Col } from "react-bootstrap";


/******************
 * How to Ausführen
 * 
 * npm install ausführen
 * Abhängigkeiten installieren
 * 
 * Terminal öffnen, "node src/mailAPI.js"
 * Startet den Mailserver
 * 
 * Zweites Terminal öffnen, "npm run electron-dev"
 * Startet die App auf localhost
 * 
 * Drittes Terminal öffnen, "npm run electron"
 * Startet die App als Desktopanwendung
 ******************/

function App() {
  const webcamRef = useRef(null);

  const [devices, setDevices] = useState([]);

  const canvasRef = useRef(null);

  /* Webcam-Management (wechseln zwischen allen Geräten) */

  // Setzt die gewählte Webcam
  const setWebcam = async (deviceId) => {
    if (!webcamRef.current) return;

    // Stoppe das aktuelle Video
    webcamRef.current.video.srcObject.getTracks().forEach(track => track.stop());

    // Starte das neue Video
    webcamRef.current.video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: deviceId }
    });
  };


  // Holt alle verfügbaren Webcams
  const getDevices = async () => {
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
    setDevices(deviceInfos.filter(device => device.kind === 'videoinput'));
  };


  // Ausführung des COCO-Modells
  const runCoco = async () => {
    window.roboflow.auth({
      publishable_key: "rf_uJRjOgRHyXdKGTSViuzUGjURjsb2"
    }).load({
      model: "aerith",
      version: 3
    }).then(function (model) {
      // Scanne alle 20 ms den aktuellen Frame nach Objekten
      setInterval(() => {
        detect(model);
      }, 100);
    });
  };



  // Wenn sich die Geräte ändern, die angeschlossen sind, dann wird die Dropdown Liste aktualisiert.
  useEffect(() => {
    getDevices();
  }, [devices]);


  const detect = async (model) => {
    // Checken, ob Webcam verfügbar ist

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      // Video - Eigenschaften verarbeiten
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
  
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
  
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
  
      // Detection-Daten erhalten
      const detections = await model.detect(video);


      const ctx = canvasRef.current.getContext('2d');
      requestAnimationFrame(() => {
        drawRect(
          detections,
          ctx,
          canvasRef,
          webcamRef,
          videoHeight, 
          videoWidth
        );
      });
    };
  };
  

  // Beim Initialisieren Intervall für Scan einrichten mit diesem Modell
  useEffect(() => { runCoco() }, []);

  return (
    <div className="App">
      <header className="App-header">

        {/* Webcam-Auswahl - Selection Element - links im Header*/}
        <Form.Control
          as="select"
          onChange={e => setWebcam(e.target.value)}
          className="webcam-select shadow border p-3 text-center"
        >
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </Form.Control>


        {/* Schriftzug in der Mitte im Header */}
        <h1 className="App-title text-white" style={{ textAlign: 'center' }}>Aerith</h1>


        {/* Logo auf der rechten Seite im Header */}
        <img src="Logo_Smartcamera.png" alt="SmartCamera Logo" className="logo" />

      </header>


      {/* Webcam-Komponente - 2 CSS Klassen eingebunden*/}

      <Webcam className="App-webcam webcam-style" ref={webcamRef} muted={true} style={{ width: 640, height: 480}} />

      {/* Canvas-Komponente */}
      <canvas className="canvas-style" ref={canvasRef} />
    </div>
  );

}

export default App;
