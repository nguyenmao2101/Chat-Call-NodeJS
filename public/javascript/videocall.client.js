
var openStream = () => {
    var configs = { video: true, audio: false };
    return navigator.mediaDevices.getUserMedia(configs);
}

var playStream = (videoTag, stream) => {
    const video = document.getElementById(videoTag);
    video.srcObject = stream;
    video.play();
}

openStream()
    .then(stream => {
        playStream("localStream", stream)
    })
    .catch(e => console.log(e));

//var peer = new Peer(); 





