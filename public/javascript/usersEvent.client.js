
var Call = (btnClicked) => {
    var idCallee = $(btnClicked).attr('value');
    window.open('/videocall/incall/?peerId=' + idCallee, '_blank', 'width=600, height=700, resizable=0');
}