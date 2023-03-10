import cv from "../opencv";
import loadDataFile from "./loadDataFile";

const minSize = new cv.Size(0, 0);
let faceCascade;

//load the OpenCv haar cascade facial detection algorithm
export async function loadHaarFaceModels() {

  //React.js Promise() must be used to load OpenCv haar cascade algorithm. Tutorials taken from sources below
  //https://docs.opencv.org/4.x/de/d06/tutorial_js_basic_ops.html
  //https://codesandbox.io/s/opencvjs-getting-started-with-videos-adapted-ptmye?file=/src/utils.js
  //https://codesandbox.io/s/opencv-js-face-detection-i1i3u?file=/src/haarFaceDetection.js
  //https://docs.opencv.org/3.4/df/d6c/tutorial_js_face_detection_camera.html

  const loadFaceCascade = async () => {
      await Promise.all([
        new Promise((resolve) => {
          setTimeout(() => {
            faceCascade = new cv.CascadeClassifier();
            faceCascade.load("cv_haarcascade_frontalface_default.xml");
            resolve();
          }, 1000);
        })
      ]);
  }
  
  //To access the file outside of the scope of src
  loadDataFile("cv_haarcascade_frontalface_default.xml", "cv_haarcascade_frontalface_default.xml")
    .then(loadFaceCascade)
    .catch((error) => {
      console.error(error);
    });
  
}

//method takes in an image and outputs a modified image with face isolated. 
export function extractFace(img) {

  let newImg = img;

  //convert image to grayscale for faster processing
  const gray = new cv.Mat();
  cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);
  const faces = new cv.RectVector();

  //Use OpenCv haar cascade algorithm to detect faces
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, minSize, minSize);

  //if there is a face in the frame, take the first face detected
  if (faces.size() >= 1) {
    console.log("=============CONSOLE TEST=============");
    const closeFace = new cv.Rect(faces.get(0).x, faces.get(0).y, faces.get(0).width, faces.get(0).height );
    console.log(closeFace);
    newImg = img.roi(closeFace);
  }

  //clearing memory
  gray.delete();
  faces.delete();

  return newImg;
}
