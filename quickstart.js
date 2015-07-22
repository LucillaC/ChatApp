var endpoint;
var activeConversation;
var previewMedia;

// check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
  alert('WebRTC is not available in your browser.');
}

// choose between one of our three pre-generated Access Tokens
var accessTokens = {'lucilla': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkLTE0Mzc1NDE4MDciLCJpc3MiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkIiwic3ViIjoiQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMyIsIm5iZiI6MTQzNzU0MTgwNywiZXhwIjoxNDM3NjI4MjA3LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTNcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzlkMThkNzE5NjM0MmQxZGUxY2U2MTkyM2M2NTgwMmUzLmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.rbx6uCgvvCDPI8xJMqKaz5mzzhP00Dp9NiQARMzcz2U',
                    'karen': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkLTE0Mzc1NDE4NTkiLCJpc3MiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkIiwic3ViIjoiQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMyIsIm5iZiI6MTQzNzU0MTg1OSwiZXhwIjoxNDM3NjI4MjU5LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTNcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzlkMThkNzE5NjM0MmQxZGUxY2U2MTkyM2M2NTgwMmUzLmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.02-uTZeBKEb7u8hC7joHEsBxhynHrC7q0ICyNfXS7jg',
                    'paul': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkLTE0Mzc1NDE4OTQiLCJpc3MiOiJTSzc3MWM0ODg0YTUyYjQ3ZGEwNTY4ZDA1YjllNzhiNDRkIiwic3ViIjoiQUM5ZDE4ZDcxOTYzNDJkMWRlMWNlNjE5MjNjNjU4MDJlMyIsIm5iZiI6MTQzNzU0MTg5NCwiZXhwIjoxNDM3NjI4Mjk0LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDOWQxOGQ3MTk2MzQyZDFkZTFjZTYxOTIzYzY1ODAyZTNcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzlkMThkNzE5NjM0MmQxZGUxY2U2MTkyM2M2NTgwMmUzLmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.XM3wlCEXrukGUv8kQzVTPgYBE2y9O2HC7YIlh10fau8'};
var userName = prompt('Please enter your name - lucilla, karen or paul.', 'lucilla');
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

  endpoint.on('invite', function (invite) {
    log('Incoming invite from: ' + invite.from);
    invite.accept().then(conversationStarted);
  });

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
  log('In an active Conversation');
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
