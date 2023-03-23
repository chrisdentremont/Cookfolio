import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut  } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, deleteField } from "firebase/firestore";
import { displayRecipes } from "./recipes";
import {displayIngredients} from "./ingredients";
import { loginPassWarning } from "./index";

let recipes;
let ingredients;

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
const db = getFirestore(app);

//Check if the user is signed in and send them to the appropriate page
onAuthStateChanged(auth, (user) => {
  const notOnHomePage = (window.location.href.includes("recipes") || 
  window.location.href.includes("accountsettings") || 
  window.location.href.includes("cookingsites") || 
  window.location.href.includes("ingredientspage"));

  if (user) {
    if(!notOnHomePage && user.emailVerified){
      window.location.href = "/dist/recipes";
    }else if(notOnHomePage && !user.emailVerified){
      window.location.href = "/dist";
    }
  } else {
    if(notOnHomePage){
      window.location.href = "/dist";
    }
  }

  //Display recipes if on the recipes page
  if(window.location.href.includes("recipes")){
    getDoc(doc(db, "users", user.uid)).then((res) => {
      displayRecipes(res.data());
    })
  }else if(window.location.href.includes("ingredients")){
    getDoc(doc(db, "users", user.uid)).then((res) => {
      displayIngredients(res.data());
    })
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
    //Email verification
    sendEmailVerification(auth.currentUser).then(() => {
      modalText.textContent = "A confirmation email has been sent. Please confirm your email before using. (Email might show up under spam folder)";
      modal.show(); 
      const user = cred.user;
      user.displayName = firstName + " " + lastName;

      //User settings
      var userInfo = {
      userSettings: {},
      recipes: {},
      ingredients: {},
      name: cred.user.displayName,
      };
      setDoc(doc(db, "users", cred.user.uid), userInfo).then(() => {
        signOut(auth);
      });
    });
  }).catch((e) => {
    modalText.textContent = e.message;
    modal.show();
  })
}

function signIn(email, password){
  signInWithEmailAndPassword(auth, email, password).then((cred) => {
    const user = cred.user;
    return "good";
  }).catch((error) => {
    if(loginPassWarning.firstChild) {loginPassWarning.removeChild(loginPassWarning.firstChild);}

    let loginPassWarningText = document.createElement("span");
    loginPassWarningText.classList.add("warning-text");
    loginPassWarningText.textContent = "Incorrect email or password.";

    loginPassWarning.appendChild(loginPassWarningText);
  });
}

function logOut(){
  signOut(auth).then(() => {
    window.location.href = "/dist";
  });
}

async function addRecipeToDb(recipe){
  let randomID = parseInt(Math.random() * 100000, 10);
  let newRecipe = {
    [randomID]: recipe
  };
  var recipes = {
    recipes: newRecipe
  };
  await setDoc(doc(db, "users", auth.currentUser.uid), recipes, {merge: true}).then(function() {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayRecipes(res.data());
    })
  });
}

async function delRecipeFromDb(recipeID){
  let newRecipe = {
    [recipeID]: deleteField()
  };
  var recipes = {
    recipes: newRecipe
  };

  await setDoc(doc(db, "users", auth.currentUser.uid), recipes, {merge: true}).then(function() {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayRecipes(res.data());
    })
  });
}

async function addIngredientToDb(ingredient){
  let randomID = parseInt(Math.random() * 100000, 10);
  let newIngredient = {
    [randomID]: ingredient
  };
  var ingredients = {
    ingredients: newIngredient
  };
  await setDoc(doc(db, "users", auth.currentUser.uid), ingredients, {merge: true}).then(function() {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayIngredients(res.data());
    })
  });
}

async function delIngredientFromDb(ingredientID){

}

export {createUser, signIn, logOut, addRecipeToDb, delRecipeFromDb, addIngredientToDb, delIngredientFromDb};