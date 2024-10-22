// src/Scanner.js
import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } } // Запрашиваем заднюю камеру
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    const tick = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          setQrCode(code.data); // Сохранить данные QR-кода
        }

        requestAnimationFrame(tick);
      }
    };

    startCamera();

    // Остановить камеру при размонтировании компонента
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []);

  return (
    <div>
      <h1>Scanner</h1>
      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
      {qrCode && <p>QR Code Data: {qrCode}</p>}
    </div>
  );
}

export default Scanner;
