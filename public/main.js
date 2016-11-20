var auth = firebase.auth();
var database = firebase.database();
var storage = firebase.storage();

var messageList = document.getElementById('message-list');
var listeningFirebaseRefs = [];

function addElement() {
  messageList.appendChild(document.createTextNode("test text"));
}

function createPostElement(key, ptn, text) {
  //var uid = firebase.auth().currentUser.uid;
  console.log(key + ' ' + ptn + ' ' + text);
  var html = '<div class="message message-' + key + '>' + '</div>';
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  return postElement;
}

function startDatabaseQueries() {
  console.log("start Database Queries");
   // [START my_top_posts_query]
   //var myUserId = firebase.auth().currentUser.uid;
   //var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
   // [END my_top_posts_query]
   // [START recent_posts_query]
   //var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
   // [END recent_posts_query]
   var messagesRef = firebase.database().ref('Contest1').limitToLast(100);
   var fetchMessages = function(postsRef, sectionElement) {
     postsRef.on('child_added', function(data) {
       console.log(data.key);
      var containerElement = sectionElement.getElementsByClassName('message-container')[0];
      //console.log(containerElement.firstChild);
      containerElement.insertBefore(
        createPostElement(data.key, data.val().ptn, data.val().text), containerElement.firstChild);
    });
   };
   fetchMessages(messagesRef, messageList);
   listeningFirebaseRefs.push(messagesRef);
}

function addCall() {

}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */

var currentUID;

function onAuthStateChanged(user) {
  console.log("Auth State Changed");
  console.log(user);
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }
  startDatabaseQueries();
  //cleanupUi();
  // if (user) {
  //   currentUID = user.uid;
  //   //splashPage.style.display = 'none';
  //   //writeUserData(user.uid, user.displayName, user.email, user.photoURL);
  //   startDatabaseQueries();
  // } else {
  //   // Set currentUID to null.
  //   currentUID = null;
  //   // Display the splash page where you can sign-in.
  //   //splashPage.style.display = '';
  // }
}

window.addEventListener('load', function() {
 //
 // signInButton.addEventListener('click', function() {
 //   var provider = new firebase.auth.GoogleAuthProvider();
 //   firebase.auth().signInWithPopup(provider);
 // });
 //
 // signOutButton.addEventListener('click', function() {
 //   firebase.auth().signOut();
 // });
 //
 console.log();
 firebase.auth().onAuthStateChanged(onAuthStateChanged);
}, false);
