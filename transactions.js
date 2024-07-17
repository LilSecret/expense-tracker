const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const incomeListTotal = document.querySelector(".income-list-total");
const expenseListTotal = document.querySelector(".expense-list-total");
const balanceTotal = document.querySelector(".balance-total");

// expenseTransactions {description, cost}[]
const expenseTransactions = [
  // { description: "Power", amount: 500, date: "7/13" },
  // { description: "Water", amount: 200, date: "7/13" },
];

// incomeTransactions {description,  cost}[]
const incomeTransactions = [
  // { description: "Salary", amount: 1500, date: "7/14" },
];

const saveNewTransactionItem = (type, description, amount, date) => {
  switch (type) {
    case "expense-list":
      wallet.expenseTotal += amount;
      expenseListTotal.innerHTML = wallet.expenseTotal;
      expenseTransactions.push({ description, amount, date });
      localStorage.setItem(
        "expense-transactions",
        JSON.stringify(expenseTransactions)
      );
      break;
    case "income-list":
      wallet.incomeTotal += amount;
      incomeListTotal.innerHTML = wallet.incomeTotal;
      incomeTransactions.push({ description, amount, date });
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
      for (let i = 0; i < expenseTransactions.length; i++) {
        if (expenseTransactions[i].description === description) {
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
        if (incomeTransactions[i].description === description) {
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

const removeTransactionFromList = (type, transactionItem) => {
  const parentList = document.querySelector(`.${type}`);
  const description = transactionItem.querySelector(".description").innerHTML;
  const priceCount = Number(
    transactionItem.querySelector(".item-price").innerHTML
  );

  removeTransactionItem(type, description, priceCount);
  parentList.removeChild(transactionItem);
  balanceTotal.innerHTML = getBalanceTotal();
};

const deployItemInTransactionList = (type, description, amount, date) => {
  const transactionList = type === "income-list" ? incomeList : expenseList;
  const listItem = document.createElement("li");

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
    storedExpenseTransactions.forEach((element) => {
      expenseTransactions.push(element);
      deployItemInTransactionList(
        "expense-list",
        element.description,
        element.amount,
        element.date
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
      incomeTransactions.push(element);
      deployItemInTransactionList(
        "income-list",
        element.description,
        element.amount,
        element.date
      );
    });
  } else {
    localStorage.setItem(
      "income-transactions",
      JSON.stringify(incomeTransactions)
    );
  }
};
