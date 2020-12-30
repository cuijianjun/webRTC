"use strict";

var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");

var videoplay = document.querySelector("video#player");
// var audioplay = document.querySelector("audio#audioplayer");

var filtersSelect = document.querySelector("select#filter");
// picture
var snapshot = document.querySelector("button#snapshot");
var picture = document.querySelector("canvas#picture");
picture.width = 320;
picture.height = 240;

var divConstraints = document.querySelector('div#constraints');
function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is not supported");
    return;
  } else {
    var deviceId = videoSource.value;
    var constraints = {
      //   video: {
      //     deviceId: deviceId? deviceId : undefined,
      //     width: {
      //       min: 300,
      //       max: 640,
      //     },
      //     height: {
      //       min: 300,
      //       max: 480,
      //     },
      //     frameRate: {
      //       min: 15,
      //       max: 30,
      //     },
      //     facingMode: "enviroment",
      //   },
      video: true,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(handleError);
  }
}
start();

videoSource.onchange = start;
filtersSelect.onchange = function () {
  videoplay.className = filtersSelect.value;
};
snapshot.onclick = function () {
  picture.className = filtersSelect.value;
  picture
    .getContext("2d")
    .drawImage(videoplay, 0, 0, picture.width, picture.height);
};

function gotMediaStream(stream) {
  console.log("stream", stream);
    videoplay.srcObject = stream;
    var videoTrack = stream.getVideoTracks()[0];
    var videoConstraints = videoTrack.getSettings();
    divConstraints.textContent = JSON.stringify(videoConstraints, null, 2)
//   audioplay.srcObject = stream;
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  console.log("deviceInfos", deviceInfos);
  deviceInfos.forEach((deviceInfo) => {
    var option = document.createElement("option");
    option.text = deviceInfo.label;
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "audioinput") {
      audioSource.appendChild(option);
    } else if (deviceInfo.kind === "audiooutput") {
      audioOutput.appendChild(option);
    } else if (deviceInfo.kind === "videoinput ") {
      videoSource.appendChild(option);
    }
  });
}
function handleError(err) {
  console.log("getUserMedia error:", err);
}
