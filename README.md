# 📷 SmartCamera – AI-Powered Object Detection App

**SmartCamera** is an AI-driven desktop application built with Electron and React that uses webcam input to detect objects in real-time. It leverages **TensorFlow** via **Roboflow**'s hosted models, and integrates a custom Node.js-based email server for notifications or data export.

---

## ✨ Features

- 🎥 Live webcam streaming
- 🧠 Real-time object detection using TensorFlow (via Roboflow)
- 🖼️ Bounding box overlay rendered on `<canvas>`
- 🔁 Multiple webcam device switching
- 📨 Email functionality via local Node.js mail server
- 🧪 Local Electron-based desktop application
- 🎨 Clean and responsive UI with React-Bootstrap

---

## 🧠 Tech Stack

| Layer      | Tech                           |
|------------|--------------------------------|
| Frontend   | React, React-Bootstrap         |
| Backend    | Node.js (local mail server)    |
| AI Model   | TensorFlow via Roboflow        |
| Deployment | Electron.js                    |
| UI Overlay | HTML5 Canvas API               |

---

## 📁 Project Structure

```
src/
├── App.js                 # Main application component (React)
├── App.css               # Global styling
├── index.js              # React DOM entry
├── index.css             # Additional base styles
├── mailAPI.js            # Custom mail server (Node.js)
├── utilities.js          # AI bounding box renderer (canvas)
├── assets/
│   └── Logo_Smartcamera.png # Application logo
```