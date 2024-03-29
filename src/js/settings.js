import "../../dist/scss/styles.scss";
import { changeUserEmail, changeUserPassword } from "./firebase";

/**
 * Error checking for when the user submits the email change form.
 * Sends the new email to the updateEmail Firebase method and looks for any errors.
 */
async function changeEmail() {
  const emailWarning = document.getElementById("emailWarning");
  emailWarning.classList.remove("warning-text", "success-text");
  emailWarning.textContent = "";

  const newEmail = document.getElementById("newEmail").value;
  const emailResult = changeUserEmail(newEmail);
  if (emailResult) {
    emailWarning.classList.add("success-text");
    emailWarning.textContent = "Email was changed successfully.";
  } else {
    emailWarning.classList.add("warning-text");
    emailWarning.textContent =
      "Something went wrong trying to change your email.";
  }
}

/**
 * Error checking for when the user submits the password change form.
 * Sends the new password to the updatePassword Firebase method and looks for any errors.
 */
async function changePassword() {
  const passwordWarning = document.getElementById("passwordWarning");
  passwordWarning.classList.remove("warning-text", "success-text");
  passwordWarning.textContent = "";

  const password1 = document.getElementById("changePassword1").value;
  const password2 = document.getElementById("changePassword2").value;

  if (password1 != password2) {
    passwordWarning.classList.add("warning-text");
    passwordWarning.textContent = "Passwords do not match.";
  } else {
    const passwordResult = changeUserPassword(password1);
    if (passwordResult) {
      passwordWarning.classList.add("success-text");
      passwordWarning.textContent = "Password was changed successfully.";
    } else {
      passwordWarning.classList.add("warning-text");
      passwordWarning.textContent =
        "Something went wrong changing your password.";
    }
  }
}

export { changeEmail, changePassword };
