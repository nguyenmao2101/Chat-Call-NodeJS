

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const idCaller = $('#idClaller').data('value')
const peer = new Peer(idCaller);

peer.on('open', id => console.log('callerId: ' + id));

var openStream = () => {
    var configs = { video: true, audio: false };
    console.log(navigator.getUserMedia);
    return navigator.mediaDevices.getUserMedia(configs);
}

var playStream = (open, videoTag, stream) => {
    const video = open.document.getElementById(videoTag);
    video.srcObject = stream;
    video.play();
}
    
var Call = (btnClicked) => {
    var idCallee = $(btnClicked).attr('value');
    var open = window.open('/videocall/incall/?peerId=' + idCallee, '_blank', 'width=600, height=700, resizable=0');
    openStream()
        .then(stream => {
            playStream(open, 'localStream', stream);
            const call = peer.call(idCallee, stream);
            console.log('calleeId: ' + idCallee);
            call.on('stream', remoteStream => playStream(open, 'remoteStream', remoteStream));
        })
        .catch(e => console.log(e))
}

peer.on('call', call => { 
    console.log('Having Calling...');
    var open = window.open('/videocall/incall/?peerId=' + call.peer, '_blank', 'width=600, height=700, resizable=0');
    openStream()
        .then(stream => {
            playStream(open, 'localStream', stream);
            call.answer(stream);
            call.on('stream', remoteStream => playStream(open, 'remoteStream', remoteStream))
        })
        .catch(e => console.log(e))
});


