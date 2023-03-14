import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

function showLogIn() {
  let logInForm = document.getElementById("loginForm");
  logInForm.classList.remove("hidden");
}

export { showLogIn };
