var endpoint;
var activeConversation;
var previewMedia;

// check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
  alert('WebRTC is not available in your browser.');
}

// generate an access token in the Twilio Account Portal - https://www.twilio.com/user/account/video/testing-tools
var accessTokens = {'alice': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkLTE0Mzc1OTU1NDAiLCJpc3MiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkIiwic3ViIjoiQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMyIsIm5iZiI6MTQzNzU5NTU0MCwiZXhwIjoxNDM3NjgxOTQwLCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTNcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6YWxpY2VAQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMy5lbmRwb2ludC50d2lsaW8uY29tIiwiYWN0IjpbImxpc3RlbiIsImludml0ZSJdfV19.toFSoLx1NoGAkG_kspobD4GGZYr2VeQd4nuv0tTSrtw',
                    'bob': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkLTE0Mzc1OTU1NzAiLCJpc3MiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkIiwic3ViIjoiQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMyIsIm5iZiI6MTQzNzU5NTU3MCwiZXhwIjoxNDM3NjgxOTcwLCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTNcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6Ym9iQEFDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTMuZW5kcG9pbnQudHdpbGlvLmNvbSIsImFjdCI6WyJsaXN0ZW4iLCJpbnZpdGUiXX1dfQ.z_kYeKW0QB85g0vuoSa6quFwqknIIi6sHPNChayTl_Q',
                    'charlie': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkLTE0Mzc1OTU1OTciLCJpc3MiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkIiwic3ViIjoiQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMyIsIm5iZiI6MTQzNzU5NTU5NywiZXhwIjoxNDM3NjgxOTk3LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTNcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6Y2hhcmxpZUBBQzlkMThkNzE5NjM0MmQxZGUxY2U2MTkyM2M2NTgwMmUzLmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.l_z9OUtGYESs5frSarztqgGMKiERIr0Er_fs53J9bpM'};
var userName = prompt('Please enter your name - alice, bob or charlie.', 'alice');
var accessToken = accessTokens[userName];

// create an Endpoint and connect to Twilio
endpoint = new Twilio.Endpoint(accessToken);
endpoint.listen().then(
  endpointConnected,
  function (error) {
    log('Could not connect to Twilio: ' + error.message);
  }
);

// successfully connected!
function endpointConnected() {
  document.getElementById('invite-controls').style.display = 'block';
  log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
};
endpoint.on('invite', function (invite) {
    log('Incoming invite from: ' + invite.from);
    invite.accept().then(conversationStarted);
  });
};
// bind button to create conversation
  document.getElementById('button-invite').onclick = function () {
    var inviteTo = document.getElementById('invite-to').value;
      if (activeConversation) {
      // add a participant
      activeConversation.invite(inviteTo);
     } else {
      // create a conversation
      var options = {};
      if (previewMedia) {
        options.localMedia = previewMedia;
      }
      endpoint.createConversation(inviteTo, options).then(
        conversationStarted,
        function (error) {
          log('Unable to create conversation');
          console.error('Unable to create conversation', error);
        }
      );
    }
  };

};

// conversation is live
function conversationStarted(conversation) {
  log("In an active Conversation");
  activeConversation = conversation;
  // draw local video, if not already previewing
  if (!previewMedia) {
    conversation.localMedia.attach('#local-media');
  }
  // when a participant joins, draw their video on screen
  conversation.on('participantConnected', function (participant) {
    log("Participant '" + participant.address + "' connected");
    participant.media.attach('#remote-media');
  });
  // when a participant disconnects, note in log
  conversation.on('participantDisconnected', function (participant) {
    log("Participant '" + participant.address + "' disconnected");
  });
  // when the conversation ends, stop capturing local video
  conversation.on('ended', function (conversation) {
    log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
    conversation.localMedia.stop();
    conversation.disconnect();
    activeConversation = null;
  });
};
//  local video preview
document.getElementById('button-preview').onclick = function () {
  if (!previewMedia) {
    previewMedia = new Twilio.LocalMedia();
    Twilio.getUserMedia().then(
      function (mediaStream) {
        previewMedia.addStream(mediaStream);
        previewMedia.attach('#local-media');
      },
      function (error) {
        console.error('Unable to access local media', error);
        log('Unable to access Camera and Microphone');
      }
    );
  };
};
// activity log
function log(message) {
  document.getElementById('log-content').innerHTML = message;
};
