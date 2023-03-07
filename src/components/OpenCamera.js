// import React, { useRef, useEffect } from 'react';
// import cv from '../opencv';

// const CameraComponent = () => {
//     let video = document.getElementById("videoSource");
//     let canvasBox = document.getElementById("canvasFrame");
//     let context = canvasBox.getContext("2d");
//     let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
//     let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
//     const FPS = 30;

//     // Get access to the camera
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//         .then(function (stream) {
//             video.srcObject = stream;
//             video.play();
//         })
//         .catch((error) => {
//             console.error('Unable to access the camera:', error);
//         });

//     // Canvas setup
//     function processVideo() {
//         let begin = Date.now();
//         context.drawImage(video, 0, 0, width, height);
//         src.data.set(context.getImageData(0, 0, width, height).data);
//         cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
//         cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;
//         // schedule next one.
//         let delay = 1000 / FPS - (Date.now() - begin);
//         setTimeout(processVideo, delay);
//     }
//     // schedule first one.
//     setTimeout(processVideo, 0);
// }

import cv from "../opencv";

let video = document.getElementById("videoSource"); //videosourve is the HTML id
video.width = 640;
video.height = 480;
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();

    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let capture = new cv.VideoCapture(video);
    const FPS = 30;
    
    function processVideo() {
      try {
        let begin = Date.now();
        // start processing.
        capture.read(src);
        // setting up delay FPS.
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
      } catch (err) {
        console.error(err);
      }
    }

    // not sure what this is for atm
    setTimeout(processVideo, 0);
  })
  //error check
  .catch(function(err) {
    console.log("An error occurred! " + err);
  });
