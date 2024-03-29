import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import { displayRecipes } from "./recipes";
import { displayIngredients } from "./ingredients";
import { loginPassWarning } from "./index";

//Firebase information
const firebaseConfig = {
  apiKey: "AIzaSyA7YoKjnhagQ-5HVUNA1zs0EMz2AD-PYbY",
  authDomain: "recipe-tracker-f4d4e.firebaseapp.com",
  projectId: "recipe-tracker-f4d4e",
  storageBucket: "recipe-tracker-f4d4e.appspot.com",
  messagingSenderId: "734970261321",
  appId: "1:734970261321:web:2ba2de648365bf5588f498",
  measurementId: "G-69Y79CZLFN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Runs when there is a detected change in authentication (usually when the page fully loads).
 *
 * Checks if the user is signed in and sends them to the appropriate page.
 * If not signed in, sends user to home page.
 */
onAuthStateChanged(auth, (user) => {
  const notOnHomePage =
    window.location.href.includes("recipes") ||
    window.location.href.includes("accountsettings") ||
    window.location.href.includes("cookingsites") ||
    window.location.href.includes("ingredientspage");

  //Send user to the home page either if they are not logged in, or their email isn't verified
  if (user) {
    if (!notOnHomePage && user.emailVerified) {
      window.location.href = "/recipes"; //Send user to recipes if they are logged in + email is verified
    } else if (notOnHomePage && !user.emailVerified) {
      window.location.href = "/"; //Send user to home page if user is logged in but email isn't verified
    }
  } else {
    if (notOnHomePage) {
      window.location.href = "/"; //Send user to home page if not logged in
    }
  }

  if (window.location.href.includes("recipes")) {
    //Display recipes if user is on the recipes page
    getDoc(doc(db, "users", user.uid)).then((res) => {
      displayRecipes(res.data());
    });
  } else if (window.location.href.includes("ingredients")) {
    //Display ingredients if user is on the ingredients page
    getDoc(doc(db, "users", user.uid)).then((res) => {
      displayIngredients(res.data());
    });
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
function createUser(email, password, firstName, lastName, modal, modalText) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //Sends user an email verifiction after account is created
      sendEmailVerification(auth.currentUser).then(() => {
        modalText.textContent =
          "A confirmation email has been sent. Please confirm your email before using. (Email might show up under spam folder)";
        modal.show();
        const user = cred.user;
        user.displayName = firstName + " " + lastName;

        //User info is created (recipes and ingredients are blank by default)
        var userInfo = {
          userSettings: {},
          recipes: {},
          ingredients: {},
          name: cred.user.displayName,
        };
        setDoc(doc(db, "users", cred.user.uid), userInfo).then(() => {
          signOut(auth); //Signs user out once everything is done, they need to verify their email
        });
      });
    })
    .catch((e) => {
      //Show any error messages that might come up during account creation
      modalText.textContent = e.message;
      modal.show();
    });
}

/**
 * Signs the user in with given email and password.
 *
 * @param {*} email Email to sign the user in with
 * @param {*} password Password to sign the user in with
 */
function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return "good";
    })
    .catch(() => {
      if (loginPassWarning.firstChild) {
        loginPassWarning.removeChild(loginPassWarning.firstChild);
      } //Prevent duplicate messages

      //Alert the user that their login information is incorrect
      let loginPassWarningText = document.createElement("span");
      loginPassWarningText.classList.add("warning-text");
      loginPassWarningText.textContent = "Incorrect email or password.";

      loginPassWarning.appendChild(loginPassWarningText);
    });
}

/**
 * Logs the user out. Calls Firebase's signOut method and then sends the user to
 * the home page once they are logged out.
 */
function logOut() {
  signOut(auth).then(() => {
    window.location.href = "/";
  });
}

/**
 * Adds a given Object containing recipe information to the user database.
 *
 * Adds new recipe to the 'recipes' object in user's data.
 *
 * @param {*} recipe Object containing recipe information to be added
 */
async function addRecipeToDb(recipe) {
  let randomID = parseInt(Math.random() * 100000, 10); //Generates a random ID number to assign to the new recipe
  let newRecipe = {
    [randomID]: recipe,
  };
  var recipes = {
    recipes: newRecipe,
  };
  //Add the new recipe to the database
  await setDoc(doc(db, "users", auth.currentUser.uid), recipes, {
    merge: true,
  }).then(function () {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayRecipes(res.data()); //Re-display user's recipes once the new one is added
    });
  });
}

/**
 * Deletes given recipe Object from the user database.
 * @param {*} recipeID
 */
async function delRecipeFromDb(recipeID) {
  let newRecipe = {
    [recipeID]: deleteField(),
  };
  var recipes = {
    recipes: newRecipe,
  };

  //Remove the recipe from user database
  await setDoc(doc(db, "users", auth.currentUser.uid), recipes, {
    merge: true,
  }).then(function () {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayRecipes(res.data()); //Re-display user's recipes once the recipe is removed
    });
  });
}

/**
 * Adds a given Object containing ingredient information to the user database.
 *
 * Adds new ingredient to the 'ingredients' object in user's data.
 *
 * @param {*} ingredient Object containing ingredient information to be added
 */
async function addIngredientToDb(ingredient, recipeID) {
  let newIngredient;
  if (recipeID != "") {
    newIngredient = {
      [recipeID]: ingredient,
    };
  } else {
    let randomID = parseInt(Math.random() * 100000, 10); //Generates a random ID number to assign to the new ingredient
    newIngredient = {
      [randomID]: ingredient,
    };
  }

  var ingredients = {
    ingredients: newIngredient,
  };

  await setDoc(doc(db, "users", auth.currentUser.uid), ingredients, {
    merge: true,
  }).then(function () {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayIngredients(res.data()); //Re-display user's ingredients once the recipe is removed
    });
  });
}

/**
 * Deletes given ingredient Object from the user database
 * @param {*} ingredientID ID of the ingredient being deleted
 */
async function delIngredientFromDb(ingredientID) {
  let newIngredient = {
    [ingredientID]: deleteField(),
  };
  var ingredients = {
    ingredients: newIngredient,
  };

  //Remove the ingredient from user database
  await setDoc(doc(db, "users", auth.currentUser.uid), ingredients, {
    merge: true,
  }).then(function () {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      displayIngredients(res.data()); //Re-display user's ingredients once the ingredient is removed
    });
  });
}

/**
 * Calls the updatePassword method in the Firebase library to change the user's password.
 * The new password that was inputted is sent to the method to change to.
 * 
 * @param {*} newPassword New password to change to
 */
async function changeUserPassword(newPassword) {
  await updatePassword(auth.currentUser, newPassword)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

/**
 * Calls the updateEmail method in the Firebase library to change the user's email.
 * The new email that was inputted is sent to the method to change to.
 * 
 * @param {*} newEmail New email to change to
 */
async function changeUserEmail(newEmail) {
  await updateEmail(auth.currentUser, newEmail)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

/**
 * Deletes the user's account from the firebase authentication table.
 * Sends the user back to the home page once their account has been deleted.
 */
async function deleteUserAccount() {
  await deleteUser(auth.currentUser).then(() => {
    location.href = "";
  });
}

export {
  createUser,
  signIn,
  logOut,
  addRecipeToDb,
  delRecipeFromDb,
  addIngredientToDb,
  delIngredientFromDb,
  changeUserEmail,
  changeUserPassword,
  deleteUserAccount,
};
