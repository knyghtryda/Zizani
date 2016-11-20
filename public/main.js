var messageList = document.getElementById('message-list');

function addElement() {
  messageList.appendChild(document.createTextNode("test text"));
}

function startDatabaseQueries() {
   // [START my_top_posts_query]
   var myUserId = firebase.auth().currentUser.uid;
   var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
   // [END my_top_posts_query]
   // [START recent_posts_query]
   var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
   // [END recent_posts_query]
   var userPostsRef = firebase.database().ref('user-posts/' + myUserId);
}
function addCall() {

}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */

var currentUID;

function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  cleanupUi();
  if (user) {
    currentUID = user.uid;
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
  }
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
 firebase.auth().onAuthStateChanged(onAuthStateChanged);
}, false);
