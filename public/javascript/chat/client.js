$ (function(){

    var socket = io('/chat');
  
    var username = document.getElementById('me').innerHTML;
    var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
    var msgCount = 0; //counting total number of messages displayed.
    var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
    var roomId;//variable for setting room.
    var toUser;
    var stt = -1;
  
    //passing data on connection.
    socket.on('connect',function(){
      socket.emit('set-user-data',username);
    });

    //receiving onlineList
    socket.on('onlineList',function(list){
      $('#list').empty();
      $('#list_msg').empty();
      stt = -1;
      for (var user in list){
        //setting txt1. shows users button.
        if(user != username){
          stt += 1;
          var img = '<img src="../../images/chat/avatars/default.svg" alt="avatar">';
          var name_friend = '<h5 id="friend_id_' + stt + '">' + user + '</h5>';
          var user_info = $('<div class="content">').append($('<h5>').append(user)).append('<span>Ho Chi Minh</span>');
          var icon = $('<div class="icon"><i data-eva="person"></i></div>');
          var user_msg = $('<div class="content">').append($('<div class="headline">').append($(name_friend)).append('<span>Today</span>')).append($('<p>Messages</p>'));
        }
        else{
            continue;
        }
        //setting txt2. shows online status.
        if(list[user] == "Online"){
          var status = $('<div class="status online">').append($(img)).append($('<i data-eva="radio-button-on">'));
          var status1 = $('<div class="status online">').append($(img)).append($('<i data-eva="radio-button-on">'));
        }
        else{
          var status = $('<div class="status offline">').append($(img)).append($('<i data-eva="radio-button-on">'));
          var status1 = $('<div class="status offline">').append($(img)).append($('<i data-eva="radio-button-on">'));
        }
        //listing all users.
        $('#list').append($('<li>').append($('<a href="#">').append(status, user_info, icon)));
        eva.replace();
        $('#list_msg').append($('<li>').append($('<a href="#chat1" class="filter direct active" data-chat="open" data-toggle="tab" role="tab" aria-controls="chat1" aria-selected="true">').append(status1, user_msg)));
        eva.replace();
      }
    });
  
  
    //Click on btnMsg
    $('#list_msg').on("click", 'li', function(){
      console.log($(this).index());

      toUser = document.getElementById('friend_id_' + $(this).index()).innerHTML;
      var room1 = username + '-' + toUser;
      var room2 = toUser + '-' + username;
      //event to set room and join.
      socket.emit('set-room', {name1: room1, name2: room2});
    });
  
    //event for setting roomId.
    socket.on('set-room',function(room){
      //empty messages.
      $('#list_detail_msg').empty();
      msgCount = 0;
      oldInitDone = 0;
      //assigning room id to roomId variable. which helps in one-to-one and group chat.
      roomId = room;
      console.log("roomId : "+ roomId);
      //event to get chat history on button click or as room is set.
      socket.emit('old-msg-init',{room:roomId,username:username,msgCount:msgCount});
  
    }); //end of set-room event.
  
    //listening old-chats event.
    socket.on('old-chats',function(data){
  
      if(data.room == roomId){
        oldInitDone = 1; //setting value to implies that old-chats first event is done.
        if(data.result.length != 0){

          for (var i = 0;i < data.result.length; i++) {
            //styling of chat message.

            var image = '<img src="../../images/chat/avatars/default.svg" alt="avatar">';
            var time = '<span>' + moment(data.result[i].createdOn) + ' <i data-eva="done-all"></span>';
            var content = '<div class="content"><div class="message"><div class="bubble"><p>' + data.result[i].msg + '</p></div>'+
            time + '</div>';
            //showing chat in chat box.
            $('#list_detail_msg').append($('<li>').append($(image), $(content)));
            msgCount++;

          }
          console.log(msgCount);
        }
        else {
          noChat = 1; //to prevent unnecessary scroll event.
        }
      }
  
    });
  
    //sending message.
    $('#form_msg').submit(function(){
      socket.emit('detail-msg',{msg:$('#input_msg').val(),msgTo:toUser,date:Date.now()});
      $('#input_msg').val("");
      return false;
    });
  
    //receiving messages.
    socket.on('detail-msg',function(data){

        //styling of chat message.
        var image = '<img src="images/chat/avatars/default.svg" alt="avatar">';
        var time = '<span>' + data.date + ' <i data-eva="done-all"></span>';
        var content = '<div class="content"><div class="message"><div class="bubble"><p>' + data.msg + '</p></div></div>'+'</div>';
        //showing chat in chat box.
        $('#list_detail_msg').append($('<li>').append($(image), $(content)));
        msgCount++;
        console.log(msgCount);
    });
  
    //on disconnect event.
    //passing data on connection.
    socket.on('disconnect',function(){
      $('#frndName').text("Disconnected..");
      msgCount = 0;
    });
});