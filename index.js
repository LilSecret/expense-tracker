const newExpenseForm = document.querySelector(".new-expense-form");
const expenseFormType = document.querySelector("#list-type");
const expenseFormDescription = document.querySelector("#description");
const expenseFormAmount = document.querySelector("#amount");
const expenseFormErrorMessage = document.querySelector(".form-error-message");

const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const incomeListTotal = document.querySelector(".income-list-total");
const expenseListTotal = document.querySelector(".expense-list-total");
const balanceTotal = document.querySelector(".balance-total");

let expenseTotal = 0;
let incomeTotal = 0;

let isFormSubmitted = false;

const addTransactionTotal = (type, amount) => {
  switch (type) {
    case "expense-list":
      expenseTotal += amount;
      expenseListTotal.innerHTML = expenseTotal;
      break;

    case "income-list":
      incomeTotal += amount;
      incomeListTotal.innerHTML = incomeTotal;
      break;

    default:
      throw new Error(`this ${type} of list is not valid`);
  }
  balanceTotal.innerHTML = getBalanceTotal();
};

const minusTransactionAmount = (type, amount) => {
  switch (type) {
    case "expense-list":
      expenseTotal -= amount;
      expenseListTotal.innerHTML = expenseTotal;
      break;

    case "income-list":
      incomeTotal -= amount;
      incomeListTotal.innerHTML = incomeTotal;
      break;

    default:
      throw new Error(`this ${type} of list is not valid`);
  }
  balanceTotal.innerHTML = getBalanceTotal();
};

const deployItemInTransactionList = (type, description, amount) => {
  console.log(type);
  const transactionList = type === "income-list" ? incomeList : expenseList;
  const listItem = document.createElement("li");

  listItem.classList.add("transaction-item");
  listItem.innerHTML = `
    <h4>${description}</h4>
    <div class="transaction-item-right">
    <div><span class='item-price'>${amount}</span>$</div>
    <span>22/3/24</span>
    <button class="remove-transaction-btn btn">
    <i class="fa-regular fa-trash-can"></i> Delete
    </button>
    </div>`;

  transactionList.appendChild(listItem);
  addTransactionTotal(type, amount);
};

const resetFormValues = () => {
  expenseFormType.value = "default";
  expenseFormDescription.value = "";
  expenseFormAmount.value = "";
  expenseFormErrorMessage.classList.remove("active");
};

const getBalanceTotal = () => {
  return incomeTotal - expenseTotal;
};

const checkFormInputsForError = () => {
  const typeInputError = expenseFormType.value === "default";
  const descriptionError = expenseFormDescription.value.length < 4;
  const amountError = Number(expenseFormAmount.value) <= 0;

  return typeInputError || descriptionError || amountError;
};

const removeTransaction = (type, transactionItem, priceAmount) => {
  const parentList = document.querySelector(`.${type}`);

  minusTransactionAmount(type, priceAmount);
  parentList.removeChild(transactionItem);
};

const addFormErrorMessage = (message) => {
  expenseFormErrorMessage.classList.add("active");
  expenseFormErrorMessage.innerHTML = message;
};

const addGlobalEventListener = (type, selector, callback) => {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
};

addGlobalEventListener("click", ".remove-transaction-btn", (e) => {
  const transaction = e.target.parentElement.parentElement;
  const transactionList =
    e.target.parentElement.parentElement.parentElement.classList[0];
  const priceNumber = Number(
    e.target.parentElement.parentElement.querySelector(".item-price").innerHTML
  );

  removeTransaction(transactionList, transaction, priceNumber);
});

newExpenseForm.addEventListener("submit", (e) => {
  const type = expenseFormType.value;
  const description = expenseFormDescription.value;
  const amount = Number(expenseFormAmount.value);

  e.preventDefault();

  if (checkFormInputsForError()) {
    addFormErrorMessage("Form credentials are invalid");
    return;
  }

  deployItemInTransactionList(type, description, amount);
  resetFormValues();
});

expenseFormAmount.addEventListener("beforeinput", function (e) {
  const nextVal =
    e.target.value.substring(0, e.target.selectionStart) +
    (e.data ?? "") +
    e.target.value.substring(e.target.selectionEnd);
  if (!/^(\d{0,7}|\d{3}-?\d{0,4}|)$/.test(nextVal)) {
    e.preventDefault();
    addFormErrorMessage("Amount only excepts a number value");
  }
  return;
});
