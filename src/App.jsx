import React from "react";
import Webcam from "react-webcam";
import cv from "./opencv";
import "./styles.css";

const { loadHaarFaceModels, extractFace } = require('./components/FaceDetection');

export default function App() {
  //state initialized to false, returns current state and way to change state
  const [modelLoaded, setModelLoaded] = React.useState(false);

  //setModelLoaded to true only after face detection algorithm is loaded
  React.useEffect(() => {
    loadHaarFaceModels().then(() => {
      setModelLoaded(true);
    });
  }, []);

  const image = React.useRef(null);
  const face = React.useRef(null);
  const camera = React.useRef(null);
  
  //useEffect hook will only run the bulk of this after modelLoaded == T
  React.useEffect(() => {
    if (!modelLoaded) return;
    const faceDetector = async () => {

      const imageStream = camera.current.getScreenshot();
      if (!imageStream) return;

      return new Promise((resolve) => {
        image.current.src = imageStream;
        image.current.onload = () => {
          try {
            const currImage = cv.imread(image.current);
            cv.imshow(face.current, extractFace(currImage));
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
  }, [modelLoaded]);

  return (
    <div className="App">
      <h2>ExpressiveNet</h2>
      <Webcam ref={camera} className="camera" mirrored screenshotFormat="image/jpeg"/>
      <img className="videoIn" alt="input" ref={image} />
      <canvas className="videoOut" ref={face} />
    </div>
  );
}


