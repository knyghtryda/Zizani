angular.module('zizaniApp')
  .controller('ZizaniController', 
    ['$scope', 
      function($scope) {

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

        var auth = firebase.auth();
        var database = firebase.database();
        var storage = firebase.storage();
        var listeningFirebaseRefs = [];

        var currentUID;

        function startDatabaseQueries() {
          console.log("start Database Queries");
           
           var messagesRef = firebase.database().ref('Contest1').limitToLast(100);
           var fetchMessages = function(postsRef) {
            postsRef.on('child_added', function(data) {
              console.log(data.key, data.val());
              $scope.recordings.unshift(data.val());
              $scope.$apply();
            });
            postsRef.on('child_changed', function(data) {
              console.log('newdata', data);
              var recordingIdx = _.findIndex($scope.recordings,{CallSid: data.val().CallSid});
              console.log(recordingIdx);
              if(recordingIdx > -1){
                $scope.recordings[recordingIdx] = data.val();
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
