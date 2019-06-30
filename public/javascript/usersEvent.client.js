"use strict";

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const idCaller = $('#id_me').val();
const peer = new Peer(idCaller);

peer.on('open', id => console.log('callerId: ' + id));

//Open media when call event
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

//Event Call 
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

//Listen on call 
peer.on('call', async call => { 
    console.log(call);
    var data = await $.ajax({   
        url: '/user/' + call.peer,
        method: 'GET',
        success: function(data){
            return data;
        },
        error: function(err){
            console.log(err)
            return null;
        }
    })
    
    if (data) {
        var result = await swal(data+" đang gọi bạn...", {
            buttons: ["Từ chối!", "Trả lời!"],
        });
        if(result){
            var open = window.open('/videocall/incall/?peerId=' + call.peer, '_blank', 'width=600, height=700, resizable=0');
            openStream()
                .then(stream => {
                    playStream(open, 'localStream', stream);
                    call.answer(stream);
                    call.on('stream', remoteStream => playStream(open, 'remoteStream', remoteStream));
                    call.on('close', () => {alert("The videocall has finished");});
                })
                .catch(e => console.log(e))
        }
    }
});

var viewInfo = (id) => {
    event.preventDefault();
    $.get({
        url: '/user/' + id,
        method: 'GET',
        success: function(data){
            window.history.pushState(data, 'Real Times App', id);
            $('#peerName').html(data.name);
            $('#videoCall').val(data._id);
            console.log(data)
        },
        error: function(err){
            console.log(err)
        }
    })
}





