const form = document.querySelector("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const pswd = document.getElementById("password");
const confirmPswd = document.getElementById("confirm-password");

//----- HELPER FUNCTIONS
function validUsername(username) {
  if (username.value.trim() === "") {
    showError(username, "Username is required");
    return false;
  } else if (username.value.trim().length < 3) {
    const message = "The minimum username length is 3";
    showError(username, message);
    return false;
  } else {
    showSuccess(username);
    return true;
  }
}

function validEmail(email) {
  const indexOfAt = email.value.trim().indexOf("@");
  const indexOfDotCom = email.value.trim().indexOf(".com");

  if (indexOfAt > 0 && indexOfDotCom > indexOfAt + 5) {
    showSuccess(email);
    return true;
  } else {
    const message = "Enter a valid email";
    showError(email, message);
    return false;
  }
}

function validPassword(pswd) {
  let message = "";
  if (pswd.value.trim().length < 6) {
    message = "The minimum password length is 6";
    showError(pswd, message);
    return false;
  } else if (pswd.value.trim().length > 25) {
    message = "The maximum password length is 25";
    showError(pswd, message);
    return false;
  } else {
    showSuccess(pswd);
    return true;
  }
}

function confirmPassword(pswd, confirmPswd) {
  if (confirmPswd.value.trim() !== pswd.value.trim()) {
    const message = "Passwords do not match";
    showError(confirmPswd, message);
    return false;
  } else {
    showSuccess(confirmPswd);
    return true;
  }
}

function showError(input, message) {
  // console.log("Error:", message);
  const inputDiv = input.parentElement;
  inputDiv.className = "input-div error";

  const small = inputDiv.querySelector("small");
  small.innerText = message;
}

function showSuccess(input) {
  const inputDiv = input.parentElement;
  inputDiv.className = "input-div success";
  inputDiv.querySelector("small").innerText = "";
}

username.addEventListener("input", function () {
  validUsername(username);
});

email.addEventListener("input", function () {
  validEmail(email);
});

pswd.addEventListener("input", function () {
  validPassword(pswd);
});

confirmPswd.addEventListener("input", function () {
  confirmPassword(pswd, confirmPswd);
});

//----- FORM LISTENER -----
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // console.log("Form submitted");

  const formIsValid =
    validUsername(username) &&
    validEmail(email) &&
    validPassword(pswd) &&
    confirmPassword(pswd, confirmPswd);

  if (formIsValid) {
    alert("Registration was successful");
    form.reset();
    document.querySelectorAll(".input-div").forEach((div) => {
      div.className = "input-div";
      div.querySelector("small").innerText = "";
    });
  }
});
