const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const incomeListTotal = document.querySelector(".income-list-total");
const expenseListTotal = document.querySelector(".expense-list-total");
const balanceTotal = document.querySelector(".balance-total");

const expenseTransactions = [];

const incomeTransactions = [];

const saveNewTransactionItem = (type, transaction) => {
  const { amount } = transaction;

  switch (type) {
    case "expense-list":
      wallet.expenseTotal += amount;
      expenseListTotal.innerHTML = wallet.expenseTotal;
      expenseTransactions.push(transaction);
      localStorage.setItem(
        "expense-transactions",
        JSON.stringify(expenseTransactions)
      );
      break;
    case "income-list":
      wallet.incomeTotal += amount;
      incomeListTotal.innerHTML = wallet.incomeTotal;
      incomeTransactions.push(transaction);
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

const removeTransactionElement = (type, transactionElement) => {
  const parentList = document.querySelector(`.${type}`);

  parentList.removeChild(transactionElement);
};

const removeTransactionInStorage = (type, transaction) => {
  const { id, amount } = transaction;

  switch (type) {
    case "expense-list":
      wallet.expenseTotal -= amount;
      expenseListTotal.innerHTML = wallet.expenseTotal;
      for (let i = 0; i < expenseTransactions.length; i++) {
        if (expenseTransactions[i].id === id) {
          expenseTransactions.splice(i, 1);
        }
      }
      localStorage.setItem(
        "expense-transactions",
        JSON.stringify(expenseTransactions)
      );
      break;

    case "income-list":
      wallet.incomeTotal -= amount;
      incomeListTotal.innerHTML = wallet.incomeTotal;
      for (let i = 0; i < incomeTransactions.length; i++) {
        if (incomeTransactions[i].id === id) {
          incomeTransactions.splice(i, 1);
        }
      }
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

const deployItemInTransactionList = (type, transaction) => {
  const transactionList = type === "income-list" ? incomeList : expenseList;
  const { id, description, date, amount } = transaction;
  const listItem = document.createElement("li");

  listItem.setAttribute("data-id", id);
  listItem.classList.add("transaction-item");
  listItem.innerHTML = `
    <h4 class="description">${description}</h4>
    <div class="transaction-item-right">
    <div><span class='item-price'>${amount}</span>$</div>
    <span class='item-date'>${date}</span>
    <button class="remove-transaction-btn btn">
    <i class="fa-regular fa-trash-can"></i> Delete
    </button>
    </div>`;

  transactionList.appendChild(listItem);
};

const loadTransactionsFromLS = () => {
  const storedExpenseTransactions = JSON.parse(
    localStorage.getItem("expense-transactions")
  );
  const storedIncomeTransactions = JSON.parse(
    localStorage.getItem("income-transactions")
  );

  if (storedExpenseTransactions) {
    storedExpenseTransactions.forEach((transaction) => {
      expenseTransactions.push(transaction);
      deployItemInTransactionList("expense-list", transaction);
    });
  } else {
    localStorage.setItem(
      "expense-transactions",
      JSON.stringify(expenseTransactions)
    );
  }

  if (storedIncomeTransactions) {
    storedIncomeTransactions.forEach((transaction) => {
      incomeTransactions.push(transaction);
      deployItemInTransactionList("income-list", transaction);
    });
  } else {
    localStorage.setItem(
      "income-transactions",
      JSON.stringify(incomeTransactions)
    );
  }
};
