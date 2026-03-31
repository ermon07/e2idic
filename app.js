// Import the functions you need from the SDKs
import { initializeApp } from "https://gstatic.com";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://gstatic.com";

// Replace with your project's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyAhzpeGWMaNrQjossS9fuuzHCR4k7Sj6kQ",
    authDomain: "eidic-1ad5c.firebaseapp.com",
    projectId: "eidic-1ad5c",
    storageBucket: "eidic-1ad5c.firebasestorage.app",
    messagingSenderId: "136102683300",
    appId: "1:136102683300:web:86770aee21d7471dadfc31",
    measurementId: "G-E0L0792GJB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('user-info');

// Handle Sign In
loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Logged in:", user.displayName);
        }).catch((error) => {
            console.error("Auth Error:", error.message);
        });
});

// Handle Sign Out
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Track Auth State Change
onAuthStateChanged(auth, (user) => {
    if (user) {
        userInfo.innerHTML = `Welcome, ${user.displayName}`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        userInfo.innerHTML = "Not signed in";
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});
