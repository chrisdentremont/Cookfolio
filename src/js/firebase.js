import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut  } from "firebase/auth";
import { } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7YoKjnhagQ-5HVUNA1zs0EMz2AD-PYbY",
  authDomain: "recipe-tracker-f4d4e.firebaseapp.com",
  projectId: "recipe-tracker-f4d4e",
  storageBucket: "recipe-tracker-f4d4e.appspot.com",
  messagingSenderId: "734970261321",
  appId: "1:734970261321:web:2ba2de648365bf5588f498",
  measurementId: "G-69Y79CZLFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  const notOnHomePage = (window.location.href.includes("recipes") || 
  window.location.href.includes("accountsettings") || 
  window.location.href.includes("cookingsites") || 
  window.location.href.includes("ingredientspage"));

  if (user) {
    if(!notOnHomePage && user.emailVerified){
      window.location.href = "/recipes";
    }else if(notOnHomePage && !user.emailVerified){
      window.location.href = "/";
    }
  } else {
    if(notOnHomePage){
      window.location.href = "/";
    }
  }

});

/**
 * Makes a new user account with a given email and password.
 * 
 * Sends the user a confirmation email when the account is created. Otherwise,
 * prints error code and message.
 * @param {*} email Email to make the account with
 * @param {*} password Password to set for the new account
 */
function createUser(email, password, firstName, lastName, modal, modalText){
  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    sendEmailVerification(auth.currentUser).then(() => {
      modalText.textContent = "A confirmation email has been sent. Please confirm your email before using.";
      modal.show(); 
      const user = cred.user;
      user.displayName = firstName + " " + lastName;
    });
  }).catch((e) => {
    modalText.textContent = e.message;
    modal.show();
  })
}

function signIn(email, password){
  signInWithEmailAndPassword(auth, email, password).then((cred) => {
    const user = cred.user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + " - " + errorMessage);
  });
}

function logOut(){
  signOut(auth).then(() => {
    window.location.href = "/";
  });
}

export {createUser, signIn, logOut};