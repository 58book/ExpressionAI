import cv from "../opencv";
import loadDataFile from "./dataTransfer";

const minSize = new cv.Size(0, 0);
let faceCascade;

export async function loadHaarFaceModels() {
  return loadDataFile(
    "cv_haarcascade_frontalface_default.xml",
    "cv_haarcascade_frontalface_default.xml"
  )
    .then(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            faceCascade = new cv.CascadeClassifier();
            faceCascade.load("cv_haarcascade_frontalface_default.xml");
            resolve();
          }, 2000);
        })
    )
    .catch((error) => {
      console.error(error);
    });
}

//method takes in an image and outputs a modified image with face drawn. 
export function detectHaarFace(img) {
  // const newImg = img.clone();
  const newImg = img;

  const gray = new cv.Mat();
  cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);

  const faces = new cv.RectVector();

  // detect and isolate faces
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, minSize, minSize);
  for (let i = 0; i < faces.size(); ++i) {
    const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
    const point2 = new cv.Point(
      faces.get(i).x + faces.get(i).width,
      faces.get(i).y + faces.get(i).height
    );
    // console.log("height: " + faces.get(i).height);
    cv.rectangle(newImg, point1, point2, [255, 0, 0, 255]);
  }

  gray.delete();
  faces.delete();

  return newImg;
}

//method takes in an image and outputs a modified image with face isolated. 
export function extractFace(img) {

  let newImg = img;

  const gray = new cv.Mat();
  cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);

  const faces = new cv.RectVector();

  // detect faces
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, minSize, minSize);
  if (faces.size() >= 1) {
    console.log("=================I AM HERE==================");
    // const point1 = new cv.Point(faces.get(0).x, faces.get(0).y);
    // const point2 = new cv.Point(
    //   faces.get(0).x + faces.get(0).width,
    //   faces.get(0).y + faces.get(0).height);
    const closeFace = new cv.Rect(faces.get(0).x, faces.get(0).y, faces.get(0).x + faces.get(0).width, faces.get(0).y + faces.get(0).height );
    console.log(closeFace);
    newImg = img.roi(closeFace);
  }

  gray.delete();
  faces.delete();

  return newImg;
}
