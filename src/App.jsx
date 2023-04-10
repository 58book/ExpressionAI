import React from "react";
import Webcam from "react-webcam";
import cv from "./opencv";
import "./styles.css";
import axios from 'axios'

const { loadHaarFaceModels, detectHaarFace, extractFace } = require('./components/FaceDetection');

export default function App() {
  //state initialized to false, returns current state and way to change state
  const [modelLoaded, setModelLoaded] = React.useState(false);

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
    if (!modelLoaded) return;
    const faceDetector = async () => {

      const imageStream = camera.current.getScreenshot();
      if (!imageStream) return;

      return new Promise((resolve) => {
        image.current.src = imageStream;
        image.current.onload = () => {
          try {
            const currImage = cv.imread(image.current);
            // detectHaarFace(currImage);
            // extractFace(currImage);
            cv.imshow(face.current, extractFace(currImage));

            let data = document.getElementById('outputImage').toDataURL('image/jpeg', 1.0)
            //data = data.replace('data:image/png;base64,', '')
            
            axios.post('/evaluate', {
                input_image: data
              },
              {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              })
            .then((response) => {
              console.log(response.data)
              currImage.delete();
              resolve();
            })
            .catch((error) => {
              console.log(error);
              resolve();
            })
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
      <h2>Emotion Recognition</h2>
      <Webcam
        ref={camera}
        className="webcam"
        mirrored
        screenshotFormat="image/jpeg"
      />
      <img className="inputImage" alt="input" ref={image} />
      <canvas id="outputImage" className="outputImage" ref={face} />
      {!modelLoaded && <div>Loading Haar-cascade face model...</div>}
    </div>
  );
}


