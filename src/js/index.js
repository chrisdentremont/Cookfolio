import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

function switchForms() {
  let logInForm = document.getElementById("loginForm");
  let signUpForm = document.getElementById("signUpForm");
  let loginHeader = document.getElementById("loginHeader");

  if(logInForm.classList.contains("hidden")){
    logInForm.classList.remove("hidden");
    signUpForm.classList.add("hidden");
    loginHeader.textContent = "Log In";
  }else{
    logInForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");
    loginHeader.textContent = "Create Account";
  }

  
}

function forgotPassword() {
  console.log("hello");
}

export { switchForms, forgotPassword };
