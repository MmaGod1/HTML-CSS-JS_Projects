const pswd = document.getElementById("password");
const copyBtn = document.getElementById("cpy-btn");

const pswdLength = document.getElementById("slide");
const lengthValue = document.getElementById("length-value");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const btn = document.querySelector(".generate-btn");
const strengthLabel = document.getElementById("strength-label");
const strengthBar = document.querySelector(".strength-bar");

/* ----- Character sets ----- */
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

/* ----- HELPER FUNCTIONS ----- */

function oneCheckRequired(uppercase, lowercase, numbers, symbols) {
  return (
    uppercase.checked || lowercase.checked || numbers.checked || symbols.checked
  );
}

function updateStrengthMeter(password) {
  const passwordLength = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()\-_=+[\]{}|;:,.<>?/]/.test(password);

  // Variety: up to 50 points
  let varietyScore = 0;
  if (hasUppercase) varietyScore += 12.5;
  if (hasLowercase) varietyScore += 12.5;
  if (hasNumbers) varietyScore += 12.5;
  if (hasSymbols) varietyScore += 12.5;

  // Length: up to 50 points
  let lengthScore = 0;
  if (passwordLength >= 16) {
    lengthScore = 50;
  } else if (passwordLength >= 12) {
    lengthScore = 35;
  } else if (passwordLength >= 8) {
    lengthScore = 20;
  } else {
    lengthScore = 10;
  }

  let strengthScore = varietyScore + lengthScore;

  let pswdStrength = "";
  if (strengthScore < 40) {
    pswdStrength = "Weak";
  } else if (strengthScore < 70) {
    pswdStrength = "Medium";
  } else {
    pswdStrength = "Strong";
  }

  strengthLabel.textContent = pswdStrength;
  strengthBar.classList.remove("weak", "medium", "strong");
  strengthBar.classList.add(pswdStrength.toLowerCase());
  strengthBar.style.width = `${strengthScore}%`;
}

function passWordGenerator(pswdLength, uppercase, lowercase, numbers, symbols) {
  let allCharacters = "";

  if (uppercase.checked) allCharacters += uppercaseLetters;
  if (lowercase.checked) allCharacters += lowercaseLetters;
  if (numbers.checked) allCharacters += numberCharacters;
  if (symbols.checked) allCharacters += symbolCharacters;

  let password = "";

  for (let i = 0; i < Number(pswdLength.value); i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}

function makePswd() {
  let password = "";
  if (!oneCheckRequired(uppercase, lowercase, numbers, symbols)) {
    alert("Check at least one option!");
  } else {
    password = passWordGenerator(
      pswdLength,
      uppercase,
      lowercase,
      numbers,
      symbols,
    );
  }

  pswd.value = password;
  updateStrengthMeter(password);
}

function showCopySuccess() {
  copyBtn.classList.remove("far", "fa-copy");
  copyBtn.classList.add("fas", "fa-check");
  copyBtn.style.color = "#48bb78";

  setTimeout(() => {
    copyBtn.classList.remove("fas", "far-check");
    copyBtn.classList.add("far", "fa-copy");
    copyBtn.style.color = "";
  }, 1500);
}

/* ----- LISTENERS ----- */
pswdLength.addEventListener("input", () => {
  lengthValue.textContent = pswdLength.value;
});

btn.addEventListener("click", makePswd);

copyBtn.addEventListener("click", () => {
  if (!pswd.value) return;

  navigator.clipboard
    .writeText(pswd)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy: ", error));
});

/* ----- RUNS THE FUNCTION ON PAGE LOAD ----- */
document.addEventListener("DOMContentLoaded", makePswd);
