import React, { useRef, useEffect } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Get access to the camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        // Attach the camera stream to the video element
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error('Unable to access the camera:', error);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CameraComponent;
