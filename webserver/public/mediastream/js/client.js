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

var divConstraints = document.querySelector("div#constraints");

//record
var recvideo = document.querySelector("video#recplayer");
var btnRecord = document.querySelector("button#record");
var btnPlay = document.querySelector("button#recplay");
var btnDownload = document.querySelector("button#download");

var buffer;
var mediaRecorder;

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is not supported");
    return;
  } else {
    var deviceId = videoSource.value;
    var constraints = {
        video: {
          deviceId: deviceId? deviceId : undefined,
          width: {
            min: 300,
            max: 320,
          },
          height: {
            min: 300,
            max: 480,
          },
          frameRate: {
            min: 15,
            max: 30,
          },
          facingMode: "enviroment",
        },
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
btnRecord.onclick = () => {
  if (btnRecord.textContent === "Start Record") {
    startRecord();
    btnRecord.textContent = "Stop Record";
    btnPlay.disabled = true;
    btnDownload.disabled = true;
  } else {
    btnRecord.textContent = "Start Record";
    btnPlay.disabled = false;
    btnDownload.disabled = false;
  }
};

btnPlay.onclick = () => {
    var blob = new Blob(buffer, {type: 'video/webm'});
    recvideo.src = URL.createObjectURL(blob);
    recvideo.srcObject = null;
    recvideo.controls = true;
    recvideo.play();
}

btnDownload.onclick = () => {
    var blob = new Blob(buffer, {
        type: 'video/webm'
    })
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.style.display = 'none'
    a.download = 'aaa.webm';
    a.click();
}

function handleDataAvailabel (e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data)
    }
}
function startRecord() {
    buffer = [];
    var options = {
        mineType: 'video/webm;codecs=vp8'
    }
    if (!MediaRecorder.isTypeSupported(options.mineType)) {
        console.log(`${options.mineType} is not supported`);
        return;
    }
    try{
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch(e) {
        console.log("Failed to create MediaRecorder：", e);
        return;
    }
    mediaRecorder.ondataavailable = handleDataAvailabel;
    mediaRecorder.start(10);
}

function stopRecord() {
    mediaRecorder.stop();
}
function gotMediaStream(stream) {
    window.stream = stream
  console.log("stream", stream);
  videoplay.srcObject = stream;
  var videoTrack = stream.getVideoTracks()[0];
  var videoConstraints = videoTrack.getSettings();
  divConstraints.textContent = JSON.stringify(videoConstraints, null, 2);
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
