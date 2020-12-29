'use strict'

var audioSource = document.querySelector("select#audioSource");
var audioOutSource = document.querySelector("select#audioOutSource");
var videoSource = document.querySelector("select#videoSource");


if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices is not supported!");
} else {
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)
    .catch(handleError);    
}

function gotDevices (deviceInfos) {
    console.log("deviceInfos", deviceInfos);
    deviceInfos.forEach(function(deviceInfo, index) {
        const {kind, label, deviceId, groupId} = deviceInfo
        var option = document.createElement('option');
        option.text = label;
        option.value = deviceId
        if(kind === 'audioinput') {
            audioSource.appendChild(option)
        } else if (kind === 'audiooutput'){
            audioOutSource.appendChild(option)
        } else if (kind === 'videoinput') {
            videoSource.appendChild(option)
        }
    })
}

function handleError(err) {
    console.log(err.name + err.message);
}