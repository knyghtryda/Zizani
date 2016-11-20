angular.module('zizaniApp')
  .controller('ZizaniController', 
    ['$scope', '$sce',  
      function($scope, $sce) {

        console.log('ZizaniController loaded');

        // Initialize Firebase
        var config = {
          apiKey: "AIzaSyCNELwMCyJKZ2G8UGvNhwo4QwOii_uqh8U",
          authDomain: "zizanie-d5720.firebaseapp.com",
          databaseURL: "https://zizanie-d5720.firebaseio.com",
          storageBucket: "zizanie-d5720.appspot.com",
          messagingSenderId: "565965359572"
        };
        firebase.initializeApp(config);

        $scope.recordings = [];
        $scope.searchText = "";

        var auth = firebase.auth();
        var database = firebase.database();
        var storage = firebase.storage();
        var listeningFirebaseRefs = [];

        var currentUID;

        $scope.playPause = function(idx, event){
          console.log(event);
          var target = event.target;
          var audio = angular.element(target).parent().find('audio');
          console.log(audio, audio.attr('src'));

          audio = audio[0];
          console.log('was paused?:', audio, audio.paused);
          if(audio.paused){
              audio.play();
          } else {
              audio.pause();
          }

          $scope.recordings[idx];

        }

        $scope.search = function(event){
          var text = $scope.searchText;

          // iterate over recordings and update each one
          $scope.recordings.forEach(function(recording){
            if(!text.length || 
              recording.text.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
              recording.watsonText.toLowerCase().indexOf(text.toLowerCase()) > -1){
              recording.show = true;
            } else {
              recording.show = false;
            }
          });
          // $scope.$apply();
          
        }


        function parseTheData(data){
          data.recUrlTrusted = $sce.trustAsResourceUrl(data.recUrl);
          data.createdAtFormatted = moment(data.createdAt).format('hh:mm:ss a');

          data.transcribed = false;
          if(data.text || data.watsonText){
            data.transcribed = true;
          }

          console.log('Updated Obj:', data)
          return data;
        }

        function startDatabaseQueries() {
          console.log("start Database Queries");
           
           var messagesRef = firebase.database().ref('Contest1').limitToLast(100);
           var fetchMessages = function(postsRef) {
            postsRef.on('child_added', function(data) {
              // console.log(data.key, data.val());
              var parsedData = parseTheData(data.val());
              $scope.recordings.unshift(parsedData);
              $scope.search();
              $scope.$apply();
            });
            postsRef.on('child_changed', function(data) {
              var recordingIdx = _.findIndex($scope.recordings,{CallSid: data.val().CallSid});
              if(recordingIdx > -1){
                
                var parsedData = parseTheData(data.val());
                $scope.recordings[recordingIdx] = parsedData;
                $scope.search();
                $scope.$apply();
              } else {
                console.error('NO RECORDING??', recordingIdx);
              }
              // console.log(data.key, data.val());
              // $scope.recordings.push(data.val());
              // $scope.$apply();
            });

           };
           fetchMessages(messagesRef);
           listeningFirebaseRefs.push(messagesRef);
        }

        function onAuthStateChanged(user) {
          console.log("Auth State Changed");
          console.log(user);
          // We ignore token refresh events.
          if (user && currentUID === user.uid) {
            return;
          }
          startDatabaseQueries();
        }

        startDatabaseQueries();
        // // On Load
        // firebase.auth().onloadAuthStateChanged(onAuthStateChanged);
      
      }
    ]
  );
