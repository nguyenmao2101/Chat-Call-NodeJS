navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var openStream = () => {
    var configs = { video: true, audio: false };
    return navigator.mediaDevices.getUserMedia(configs);
}

var playStream = (videoTag, stream) => {
    const video = document.getElementById(videoTag);
    video.srcObject = stream;
    video.play();
}

//PEER CONNECT
var idCaller = $('#local').data('value');
var idCallee = $('#remote').data('value');
const peer = new Peer(idCaller);
peer.on('open', id => console.log('callerId: ' + id));

//CALLER
openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(idCallee, stream);
        console.log('calleeId: ' + idCallee);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
    .catch(e => console.log(e))

//CALLEE
peer.on('call', call => { 
    console.log('CALLEE');
    window.open('/videocall/incall/?peerId=' + idCallee, '_blank', 'width=600, height=700, resizable=0');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            call.answer(stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        })
        .catch(e => console.log(e))
});
