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

const wallet = {
  expenseTotal: 0,
  incomeTotal: 0,
};

// expenseTransactions {description, cost}[]
const expenseTransactions = [];

// incomeTransactions {description,  cost}[]
const incomeTransactions = [];

let isFormSubmitted = false;

const getBalanceTotal = () => {
  return wallet.incomeTotal - wallet.expenseTotal;
};

const saveNewTransactionItem = (type, description, amount) => {
  switch (type) {
    case "expense-list":
      wallet.expenseTotal += amount;
      expenseListTotal.innerHTML = wallet.expenseTotal;
      expenseTransactions.push({ description, amount });
      localStorage.setItem(
        "expense-transactions",
        JSON.stringify(expenseTransactions)
      );
      break;
    case "income-list":
      wallet.incomeTotal += amount;
      incomeListTotal.innerHTML = wallet.incomeTotal;
      incomeTransactions.push({ description, amount });
      localStorage.setItem(
        "income-transactions",
        JSON.stringify(incomeTransactions)
      );
      break;

    default:
      throw new Error(`this ${type} list does not exist`);
  }
  localStorage.setItem("wallet", JSON.stringify(wallet));
};

const removeTransactionItem = (type, description, amount) => {
  switch (type) {
    case "expense-list":
      wallet.expenseTotal -= amount;
      expenseListTotal.innerHTML = wallet.expenseTotal;
      //remove from expense transactions
      localStorage.setItem(
        "expense-transactions",
        JSON.stringify(expenseTransactions)
      );
      break;

    case "income-list":
      wallet.incomeTotal -= amount;
      incomeListTotal.innerHTML = wallet.incomeTotal;
      //remove from income transactions
      localStorage.setItem(
        "income-transactions",
        JSON.stringify(incomeTransactions)
      );
      break;

    default:
      throw new Error(`this ${type} of list is not valid`);
  }

  localStorage.setItem("wallet", JSON.stringify(wallet));
};

const deployItemInTransactionList = (type, description, amount) => {
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
};

const resetFormValues = () => {
  expenseFormType.value = "default";
  expenseFormDescription.value = "";
  expenseFormAmount.value = "";
  expenseFormErrorMessage.classList.remove("active");
};

const checkFormInputsForError = () => {
  const typeInputError = expenseFormType.value === "default";
  const descriptionError = expenseFormDescription.value.length < 4;
  const amountError = Number(expenseFormAmount.value) <= 0;

  return typeInputError || descriptionError || amountError;
};

const removeTransaction = (type, transactionItem) => {
  const parentList = document.querySelector(`.${type}`);
  const priceCount = Number(
    transactionItem.querySelector(".item-price").innerHTML
  );

  minusTransactionAmount(type, priceCount);
  parentList.removeChild(transactionItem);
};

const addFormErrorMessage = (message) => {
  expenseFormErrorMessage.classList.add("active");
  expenseFormErrorMessage.innerHTML = message;
};

const loadWalletFromLS = () => {
  const storedWallet = JSON.parse(localStorage.getItem("wallet"));

  if (storedWallet) {
    for (const property in storedWallet) {
      const firstWord = firstWordOfCamelCaseStr(property);

      wallet[property] = storedWallet[property];
      document.querySelector("." + firstWord + "-list-total").innerHTML =
        wallet[property];
    }
    console.log(wallet);
    balanceTotal.innerHTML = getBalanceTotal();
  } else {
    localStorage.setItem(
      "wallet",
      JSON.stringify({
        expenseTotal: wallet.expenseTotal,
        incomeTotal: wallet.incomeTotal,
      })
    );
  }
};

const loadTransactionsFromLS = () => {
  const storedExpenseTransactions = JSON.parse(
    localStorage.getItem("expense-transactions")
  );
  const storedIncomeTransactions = JSON.parse(
    localStorage.getItem("income-transactions")
  );

  if (storedExpenseTransactions) {
    storedExpenseTransactions.forEach((element) => {
      deployItemInTransactionList(
        "expense-list",
        element.description,
        element.amount
      );
    });
  } else {
    localStorage.setItem(
      "expense-transactions",
      JSON.stringify(expenseTransactions)
    );
  }

  if (storedIncomeTransactions) {
    storedIncomeTransactions.forEach((element) => {
      deployItemInTransactionList(
        "income-list",
        element.description,
        element.amount
      );
    });
  } else {
    localStorage.setItem(
      "income-transactions",
      JSON.stringify(incomeTransactions)
    );
  }
};

const loadLocalStorage = () => {
  loadWalletFromLS();
  loadTransactionsFromLS();
};

const onStartup = () => {
  loadLocalStorage();
};

const firstWordOfCamelCaseStr = (string) => {
  return string.replace(/([A-Z])/g, " $1").split(" ")[0];
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

  removeTransaction(transactionList, transaction);
});

onStartup();

newExpenseForm.addEventListener("submit", (e) => {
  const type = expenseFormType.value;
  const description = expenseFormDescription.value;
  const amount = Number(expenseFormAmount.value);

  e.preventDefault();

  if (checkFormInputsForError()) {
    addFormErrorMessage("Form credentials are invalid");
    return;
  }

  saveNewTransactionItem(type, description, amount);
  deployItemInTransactionList(type, description, amount);
  balanceTotal.innerHTML = getBalanceTotal();
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
