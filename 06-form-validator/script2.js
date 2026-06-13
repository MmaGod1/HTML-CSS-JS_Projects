const form = document.querySelector("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const pswd = document.getElementById("password");
const confirmPswd = document.getElementById("confirm-password");

function formatChar(input) {
  return input.id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function checkRequired(inputArray) {
  let isValid = true;

  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${formatChar(input)} is required!`);
      isValid = false;
    }
  });

  return isValid;
}

function showError(input, message) {
  const inputParent = input.parentElement;
  const small = inputParent.querySelector("small");

  inputParent.className = "input-div error";
  small.innerText = message;
}

function showSuccess(input) {
  const inputParent = input.parentElement;

  inputParent.className = "input-div success";
  inputParent.querySelector("small").innerText = "";
}

function checkLength(input, min, max) {
  const value = input.value.trim();

  if (value.length < min) {
    showError(
      input,
      `${formatChar(input)} should have a minimum of ${min} characters.`,
    );
    return false;
  } else if (value.length > max) {
    showError(
      input,
      `${formatChar(input)} should have a maximum of ${max} characters.`,
    );
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

function checkEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(email.value.trim())) {
    showSuccess(email);
    return true;
  } else {
    showError(email, `${formatChar(email)} is not a valid email address!`);
    return false;
  }
}

function confirmPassword(pswd1, pswd2) {
  if (pswd1.value.trim() !== pswd2.value.trim()) {
    showError(pswd2, `Passwords do not match`);
    return false;
  } else {
    showSuccess(pswd2);
    return true;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isRequired = checkRequired([username, email, pswd, confirmPswd]);
  let formIsValid = false;

  if (isRequired) {
    const isUsernameValid = checkLength(username, 3, 15);
    const isEmailValid = checkEmail(email);
    const isPswdValid = checkLength(pswd, 6, 25);
    const pswdMatch = confirmPassword(pswd, confirmPswd);

    formIsValid = isUsernameValid && isEmailValid && isPswdValid && pswdMatch;
  }

  if (formIsValid) {
    alert("Registration was successful!");
    form.reset();
    document.querySelectorAll(".input-div").forEach((div) => {
      div.className = "input-div";
    });
  }
});

function liveValidation() {
  username.addEventListener("input", function () {
    checkLength(username, 3, 15);
  });

  email.addEventListener("input", function () {
    checkEmail(email);
  });

  pswd.addEventListener("input", function () {
    checkLength(pswd, 6, 25);
  });

  confirmPswd.addEventListener("input", function () {
    confirmPassword(pswd, confirmPswd);
  });
}

liveValidation();
