import React from "react";
import Webcam from "react-webcam";
import cv from "./opencv";
import "./styles.css";

const { loadHaarFaceModels, detectHaarFace } = require('./components/FaceDetection');

export default function App() {
  //state initialized to false, returns current state and way to change state
  const [modelLoded, setModelLoaded] = React.useState(false);

  //setModelLoaded to true only after 
  React.useEffect(() => {
    loadHaarFaceModels().then(() => {
      setModelLoaded(true);
    });
  }, []);

  const image = React.useRef(null);
  const face = React.useRef(null);
  const camera = React.useRef(null);
  
  React.useEffect(() => {
    if (!modelLoded) return;
    const faceDetector = async () => {

      const imageStream = camera.current.getScreenshot();
      if (!imageStream) return;

      return new Promise((resolve) => {
        image.current.src = imageStream;
        image.current.onload = () => {
          try {
            const currImage = cv.imread(image.current);
            detectHaarFace(currImage);
            cv.imshow(face.current, currImage);

            currImage.delete();
            resolve();
          } catch (error) {
            console.log(error);
            resolve();
          }
        };
      });
    };

    let handle;
    const nextTick = () => {
      handle = requestAnimationFrame(async () => {
        await faceDetector();
        nextTick();
      });
    };
    nextTick();
    return () => {
      cancelAnimationFrame(handle);
    };
  }, [modelLoded]);

  return (
    <div className="App">
      <h2>Emotion Recognition</h2>
      <Webcam
        ref={camera}
        className="webcam"
        mirrored
        screenshotFormat="image/jpeg"
      />
      <img className="inputImage" alt="input" ref={image} />
      <canvas className="outputImage" ref={face} />
      {!modelLoded && <div>Loading Haar-cascade face model...</div>}
    </div>
  );
}


