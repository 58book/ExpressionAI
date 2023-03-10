import cv from "../opencv";

async function loadDataFile(fileLoc, url) {
  const res = await fetch(url);
  const buff = await res.arrayBuffer();
  const info = new Uint8Array(buff);
  cv.FS_createDataFile("/", fileLoc, info, true, false, false);
}

export default loadDataFile;
