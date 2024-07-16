const wallet = {
  expenseTotal: 0,
  incomeTotal: 0,
};

let isFormSubmitted = false;

const getBalanceTotal = () => {
  return wallet.incomeTotal - wallet.expenseTotal;
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

const loadLocalStorage = () => {
  loadWalletFromLS();
  loadTransactionsFromLS();
  loadTransactionDataAmount();
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

const onStartup = () => {
  loadLocalStorage();
};

onStartup();

addGlobalEventListener("click", ".remove-transaction-btn", (e) => {
  const transaction = e.target.parentElement.parentElement;
  const transactionList =
    e.target.parentElement.parentElement.parentElement.classList[0];

  removeTransactionFromList(transactionList, transaction);
});

newExpenseForm.addEventListener("submit", (e) => {
  const type = expenseFormType.value;
  const description = expenseFormDescription.value;
  const amount = Number(expenseFormAmount.value);
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const year = new Date().getFullYear().toString().slice(-2);
  const date = `${month}/${day}/${year}`;

  e.preventDefault();

  if (checkFormInputsForError()) {
    addFormErrorMessage("Form credentials are invalid");
    return;
  }

  saveNewTransactionItem(type, description, amount, date);
  deployItemInTransactionList(type, description, amount, date);
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
