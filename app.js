// app.js
const firebaseConfig = { /* ... your config ... */ };
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Handle Sign-in Click with Popup
document.getElementById('signInButton').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then(result => console.log("User signed in:", result.user))
        .catch(error => console.error(error));
});

// Monitor Auth State
auth.onAuthStateChanged(user => {
    if (user) console.log("User is signed in");
    else console.log("User is signed out");
});
