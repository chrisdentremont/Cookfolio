import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {createUser, signIn} from "./firebase";

let logInForm;
let signUpForm ;
let loginHeader;

let signUpModal;
let signUpModalText;

let passwordWarning;
let firstNameWarning;
let lastNameWarning;
let loginPassWarning;

window.onload = function(){
  logInForm = document.getElementById("loginForm");
  signUpForm = document.getElementById("signUpForm");
  loginHeader = document.getElementById("loginHeader");

  signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
  signUpModalText = document.getElementById("signUpModalText");

  passwordWarning = document.getElementById("passwordWarning");
  firstNameWarning = document.getElementById("firstNameWarning");
  lastNameWarning = document.getElementById("lastNameWarning");
  loginPassWarning = document.getElementById("passwordError");

  logInForm.addEventListener("submit", logIn);
  signUpForm.addEventListener("submit", signUp);
}

function switchForms() {
  if(logInForm.classList.contains("hidden")){
    logInForm.classList.remove("hidden");
    signUpForm.classList.add("hidden");
    loginHeader.textContent = "Log In";
  }else{
    logInForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");
    loginHeader.textContent = "Create Account";
  }


  if(passwordWarning.firstChild) {passwordWarning.removeChild(passwordWarning.firstChild);}
  if(firstNameWarning.firstChild) {firstNameWarning.removeChild(firstNameWarning.firstChild);}
  if(lastNameWarning.firstChild) {lastNameWarning.removeChild(lastNameWarning.firstChild);}
  logInForm.reset();
  signUpForm.reset();    
}

function signUp(event){
  event.preventDefault();

  const firstName = event.target.elements[0].value;
  const lastName = event.target.elements[1].value;
  const email = event.target.elements[2].value;
  const pass1 = event.target.elements[3].value;
  const pass2 = event.target.elements[4].value;

  let goodSubmit = true;

  if(pass1 != pass2 || (pass1.length > 30 || pass1.length < 6)){
    goodSubmit = false;
    if(passwordWarning.firstChild) {passwordWarning.removeChild(passwordWarning.firstChild);}

    let passwordWarningText = document.createElement("span");
    passwordWarningText.classList.add("warning-text");
    passwordWarningText.textContent = "Passwords must match and/or be between 6-30 characters long.";

    passwordWarning.appendChild(passwordWarningText);
  }else{
    if(passwordWarning.firstChild) {passwordWarning.removeChild(passwordWarning.firstChild);}
  }

  if(firstName.length > 30){
    goodSubmit = false;
    if(firstNameWarning.firstChild) {firstNameWarning.removeChild(firstNameWarning.firstChild);}

    let firstNameWarningText = document.createElement("span");
    firstNameWarningText.classList.add("warning-text");
    firstNameWarningText.textContent = "First name must be less than 30 characters.";

    firstNameWarning.appendChild(firstNameWarningText);
  }else{
    if(firstNameWarning.firstChild) {firstNameWarning.removeChild(firstNameWarning.firstChild);}
  }

  if(lastName.length > 60){
    goodSubmit = false;
    if(lastNameWarning.firstChild) {lastNameWarning.removeChild(lastNameWarning.firstChild);}

    let lastNameWarningText = document.createElement("span");
    lastNameWarningText.classList.add("warning-text");
    lastNameWarningText.textContent = "Last name must be less than 60 characters.";

    lastNameWarning.appendChild(lastNameWarningText);
  }else{
    if(lastNameWarning.firstChild) {lastNameWarning.removeChild(lastNameWarning.firstChild);}
  }

  if(goodSubmit){
    createUser(email, pass1, firstName, lastName, signUpModal, signUpModalText);
    signUpForm.reset();
  }

}

function logIn(event){
  event.preventDefault();

  const email = event.target.elements[0].value;
  const password = event.target.elements[1].value;

  signIn(email, password);
  logInForm.reset();
}

function forgotPassword() {
  
}

export { switchForms, forgotPassword, loginPassWarning };
