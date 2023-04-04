import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {createUser, signIn} from "./firebase";

/**
 * Empty variables that are set in the window.onload function once the page is fully loaded. 
 * They are defined here so that they are accessible by any function.
 */
let logInForm;
let signUpForm ;
let loginHeader;

let signUpModal;
let signUpModalText;

let passwordWarning;
let firstNameWarning;
let lastNameWarning;
let loginPassWarning;

/**
 * This function is run once the page has been fully loaded.
 * The login and signup form elements are retrieved from the DOM to be used in the code.
 * Events are added to the login and signup forms to run specific functions when they are submitted.
 */
window.onload = function(){
  //Forms
  logInForm = document.getElementById("loginForm");
  signUpForm = document.getElementById("signUpForm");
  loginHeader = document.getElementById("loginHeader");

  //Sign up modal 
  signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
  signUpModalText = document.getElementById("signUpModalText");

  //Error texts
  passwordWarning = document.getElementById("passwordWarning");
  firstNameWarning = document.getElementById("firstNameWarning");
  lastNameWarning = document.getElementById("lastNameWarning");
  loginPassWarning = document.getElementById("passwordError");

  //Form submit listeners
  logInForm.addEventListener("submit", logIn);
  signUpForm.addEventListener("submit", signUp);
}

/**
 * Hides the login form to display the signup form and vice versa.
 * Resets the forms when they are switched.
 */
function switchForms() {
  if(logInForm.classList.contains("hidden")){ //Switching to login form from signup form
    logInForm.classList.remove("hidden");
    signUpForm.classList.add("hidden");
    loginHeader.textContent = "Log In";
  }else{ //Switching to signup form from login form
    logInForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");
    loginHeader.textContent = "Create Account";
  }

  //Remove any error warnings when switching to new form
  if(passwordWarning.firstChild) {passwordWarning.removeChild(passwordWarning.firstChild);}
  if(firstNameWarning.firstChild) {firstNameWarning.removeChild(firstNameWarning.firstChild);}
  if(lastNameWarning.firstChild) {lastNameWarning.removeChild(lastNameWarning.firstChild);}

  //Reset form values when switching
  logInForm.reset();
  signUpForm.reset();    
}

/**
 * The function that is ran when the signup form is submitted.
 * User information is pulled from the form data:
 *    - Fields are checked for any errors and appropriate errors are displayed on the page.
 *    - If no fields have errors, fields are sent to the createUser function in the Firebase script.
 * Signup form is reset once the information is sent.
 * @param {*} event The form submit event - contains entered field data
 */
function signUp(event){
  event.preventDefault(); //Prevent the page from reloading

  //Get entered fields from form data
  const firstName = event.target.elements[0].value;
  const lastName = event.target.elements[1].value;
  const email = event.target.elements[2].value;
  const pass1 = event.target.elements[3].value;
  const pass2 = event.target.elements[4].value;

  let goodSubmit = true;

  if(pass1 != pass2 || (pass1.length > 30 || pass1.length < 6)){ //Passwords either don't match or don't meet length requirements
    goodSubmit = false;
    //Prevent duplicate error messages
    if(passwordWarning.firstChild) {passwordWarning.removeChild(passwordWarning.firstChild);}

    let passwordWarningText = document.createElement("span");
    passwordWarningText.classList.add("warning-text");
    passwordWarningText.textContent = "Passwords must match and/or be between 6-30 characters long.";

    passwordWarning.appendChild(passwordWarningText);
  }else{
    //Prevent duplicate error messages
    if(passwordWarning.firstChild) {passwordWarning.removeChild(passwordWarning.firstChild);}
  }

  if(firstName.length > 30){ //First name is too long (more than 30 characters)
    goodSubmit = false;
    //Prevent duplicate error messages
    if(firstNameWarning.firstChild) {firstNameWarning.removeChild(firstNameWarning.firstChild);}

    let firstNameWarningText = document.createElement("span");
    firstNameWarningText.classList.add("warning-text");
    firstNameWarningText.textContent = "First name must be less than 30 characters.";

    firstNameWarning.appendChild(firstNameWarningText);
  }else{
    //Prevent duplicate error messages
    if(firstNameWarning.firstChild) {firstNameWarning.removeChild(firstNameWarning.firstChild);}
  }

  if(lastName.length > 60){ //Last name is too long (longer than 60 characters)
    goodSubmit = false;
    //Prevent duplicate error messages
    if(lastNameWarning.firstChild) {lastNameWarning.removeChild(lastNameWarning.firstChild);}

    let lastNameWarningText = document.createElement("span");
    lastNameWarningText.classList.add("warning-text");
    lastNameWarningText.textContent = "Last name must be less than 60 characters.";

    lastNameWarning.appendChild(lastNameWarningText);
  }else{
    //Prevent duplicate error messages
    if(lastNameWarning.firstChild) {lastNameWarning.removeChild(lastNameWarning.firstChild);}
  }

  //If all fields are valid, send information to the createUser function in the Firebase script
  //so that an account can be created for the user.
  if(goodSubmit){
    createUser(email, pass1, firstName, lastName, signUpModal, signUpModalText);
    //Reset the signup form after the account is made.
    signUpForm.reset();
  }

}

/**
 * The function that is ran when the login form is submitted.
 * Entered fields are pulled from form data and send to the signIn method in the Firebase script.
 * 
 * Any login error messages are handled by the method in the Firebase script.
 * 
 * @param {*} event The form submit event - contains entered field data
 */
function logIn(event){
  event.preventDefault(); //Prevent page from reloading

  //Get entered email and password
  const email = event.target.elements[0].value;
  const password = event.target.elements[1].value;

  //Send information to signIn function in Firebase script - everything else is handled there
  signIn(email, password);
  logInForm.reset(); //Reset login form regardless of result
}

export { switchForms, loginPassWarning };
