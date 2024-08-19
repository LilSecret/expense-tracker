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
  loadTransactionChartData();
  loadDatesIntoFilters();
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
  const transactionElement = e.target.parentElement.parentElement;
  const transactionList =
    e.target.parentElement.parentElement.parentElement.classList[0];
  const id = transactionElement.getAttribute("data-id");
  const description =
    transactionElement.querySelector(".description").innerHTML;
  const date = transactionElement.querySelector(".item-date").innerHTML;
  const amount = Number(
    transactionElement.querySelector(".item-price").innerHTML
  );

  const transaction = {
    id,
    description,
    date,
    amount,
  };

  removeTransactionElement(transactionList, transactionElement);
  removeTransactionInStorage(transactionList, transaction);
  removeTransactionFromChart(transactionList, transaction);
  balanceTotal.innerHTML = getBalanceTotal();
});

newExpenseForm.addEventListener("submit", (e) => {
  const type = expenseFormType.value;
  const description = expenseFormDescription.value;
  const amount = Number(expenseFormAmount.value);
  const date = new Date("08/21").toLocaleDateString("en-US", {
    day: "numeric",
    month: "2-digit",
  });
  const id = Math.random().toString(16).slice(2, 10);

  const transaction = {
    id,
    description,
    date,
    amount,
  };

  e.preventDefault();

  if (checkFormInputsForError()) {
    addFormErrorMessage("Form credentials are invalid");
    return;
  }

  saveNewTransactionItem(type, transaction);
  deployItemInTransactionList(type, transaction);
  loadDatesIntoFilters();
  addTransactionToChart(type, transaction);
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

filterForm.addEventListener("submit", handleFilterSubmit);
filterResetBtn.addEventListener("click", handleFilterReset);
