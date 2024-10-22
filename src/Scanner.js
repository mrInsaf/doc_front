// src/Scanner.js
import React, { useEffect, useRef } from 'react';

function Scanner() {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
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
    </div>
  );
}

export default Scanner;
