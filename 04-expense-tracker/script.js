const totalBalance = document.getElementById("total-balance");
const income = document.querySelector(".income p");
const expenses = document.querySelector(".expenses p");
const form = document.querySelector("form");
const error = document.getElementById("error");
const list = document.getElementById("transaction-list");

let expenseAmount = 0;
let incomeAmount = 0;
let total = 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || {
  description: [],
  amount: [],
};

// ----- FORMAT CURRENCY -----
function formatCurrency(number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(number);
}

//----- CREATE LI FUNCTION -----
function createLi(desc, amount) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const deleteBtn = document.createElement("button");
  const rightDiv = document.createElement("div");

  rightDiv.classList.add("right-group");
  li.classList.add(amount > 0 ? "income-li" : "expense-li");
  deleteBtn.classList.add("delete-btn");

  li.appendChild(document.createTextNode(desc));
  span.textContent = li.classList.contains("expense-li")
    ? `-${formatCurrency(Math.abs(amount))}`
    : formatCurrency(amount);
  deleteBtn.textContent = "x";

  deleteBtn.addEventListener("click", function () {
    const index = transactions.description.indexOf(desc);
    transactions.description.splice(index, 1);
    transactions.amount.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (amount < 0) {
      expenseAmount -= amount;
      expenses.textContent = formatCurrency(Math.abs(expenseAmount));
    } else {
      incomeAmount -= amount;
      income.textContent = formatCurrency(incomeAmount);
    }

    total -= amount;
    totalBalance.textContent = formatCurrency(total);

    li.remove();
  });

  rightDiv.appendChild(span);
  rightDiv.appendChild(deleteBtn);
  li.appendChild(rightDiv);
  return li;
}

//------ LOAD ON PAGE START ------
transactions.description.forEach(function (desc, i) {
  const amount = transactions.amount[i];

  if (amount < 0) {
    expenseAmount += amount;
  } else {
    incomeAmount += amount;
  }
  total += amount;

  list.append(createLi(desc, amount));
});

/* ----- WITHOUT FORMAT CURRENCY 
income.textContent = `₦ ${incomeAmount}`;
expenses.textContent = `₦${Math.abs(expenseAmount)}`;
totalBalance.textContent = `₦ ${total}`;
-----*/

//----- WITH FORMAT CURRENCY -----
income.textContent = formatCurrency(incomeAmount);
expenses.textContent = formatCurrency(Math.abs(expenseAmount));
totalBalance.textContent = formatCurrency(total);

//----- FORM SUBMIT -----
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const desc = document.getElementById("description").value;
  const amount = Number(document.getElementById("amount").value);

  if (!desc || isNaN(amount) || amount === 0) return;
  if (amount < 0 && Math.abs(amount) > total) {
    error.textContent = "Expense is greater than balance";
    return;
  }

  if (amount < 0) {
    expenseAmount += amount;
    expenses.textContent = formatCurrency(Math.abs(expenseAmount));
    total += amount;
  } else {
    incomeAmount += amount;
    income.textContent = formatCurrency(incomeAmount);
    total += amount;
  }

  transactions.description.unshift(desc);
  transactions.amount.unshift(amount);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  list.prepend(createLi(desc, amount));

  totalBalance.textContent = formatCurrency(total);
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  error.textContent = "";
});
