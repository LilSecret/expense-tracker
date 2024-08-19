const fromFilterInput = document.querySelector("#from");
const toFilterInput = document.querySelector("#to");

const filterMessage = document.querySelector("#filter-error-message");
const filterActions = document.querySelector(".filter-actions");

const filterForm = document.querySelector("#filter-form");
const filterResetBtn = document.querySelector("#filter-reset");

const toggleFilterValidation = (boolean) => {};

const toggleFilterError = (showError, message) => {
  filterActions.setAttribute("data-visible", showError ? "false" : "true");
  filterMessage.innerHTML = showError ? message : "";
  filterMessage.setAttribute("data-visible", showError ? "true" : "false");
};

const validateFilterDates = (fromDestination) => {
  const storedDates = getUniqueSortedDates(fromDestination);

  if (storedDates.length >= 3) {
    toggleFilterError(false);
    return storedDates;
  }
  toggleFilterError(true, "Please provide more dates to allow filtering.");
};

const createOptionElement = (value, title) => {
  const optionElement = document.createElement("option");
  optionElement.setAttribute("value", value);
  optionElement.innerHTML = title;
  return optionElement;
};

const addDatesToFilterOptions = (dates) => {
  const fromDates = dates.slice(0, -1);
  const toDates = dates.slice(1, dates.length);

  fromFilterInput.innerHTML = `<option value="default" disabled selected>Select a date</option>`;
  toFilterInput.innerHTML = `<option value="default" disabled selected>Select a date</option>`;

  fromDates.forEach((date) => {
    const optionElement = createOptionElement(date, date);
    fromFilterInput.appendChild(optionElement);
  });
  toDates.forEach((date) => {
    const optionElement = createOptionElement(date, date);
    toFilterInput.appendChild(optionElement);
  });
};

const loadDatesIntoFilters = () => {
  const storedDates = validateFilterDates("localStorage");

  if (storedDates) {
    addDatesToFilterOptions(storedDates);
  }
};

const getFilteredTransactions = (transactions, fromDate, toDate) => {
  const currentFromDate = strDateToJSDate(fromDate);
  const currentToDate = strDateToJSDate(toDate);

  const datedTransactions = transactions.map((expense) => ({
    ...expense,
    date: strDateToJSDate(expense.date),
  }));

  return datedTransactions.filter((transaction) => {
    return (
      transaction.date >= currentFromDate && transaction.date <= currentToDate
    );
  });
};

const addFilteredTransactionsInList = (type, transactions) => {
  const transactionList = type === "income-list" ? incomeList : expenseList;

  transactionList.innerHTML = "";
  transactions.forEach((transaction) =>
    deployItemInTransactionList(type, transaction)
  );
};

const validateFromAndToDates = (fromDate, toDate) => {
  const fromDateJS = new Date(fromDate);
  const toDateJS = new Date(toDate);

  if (fromDateJS.getTime() > toDateJS.getTime()) {
    alert("Please enter from date before to date");
    return false;
  }

  if (fromDate === "default" || toDate === "default") {
    alert("Enter a correct From and To date");
    return false;
  }

  return true;
};

const filterChartData = (filteredDates) => {
  const filteredExpenseChartData = filteredDates.map((date) =>
    expenseChartData.find((data) => data.date === date)
  );
  const filteredIncomeChartData = filteredDates.map((date) =>
    incomeChartData.find((data) => data.date === date)
  );

  chart.data.labels = filteredDates;
  chart.data.datasets.forEach((graph) => {
    switch (graph.label) {
      case "Income":
        graph.data = filteredIncomeChartData.map((dataDate) => dataDate.amount);
        break;
      case "Expenses":
        graph.data = filteredExpenseChartData.map(
          (dataDate) => dataDate.amount
        );
        break;
      default:
        throw new Error(graph + "does not exist");
    }
  });
  chart.update();
};

const handleFilterSubmit = (e) => {
  e.preventDefault();

  const fromDate = fromFilterInput.value;
  const toDate = toFilterInput.value;

  const isFromAndToValid = validateFromAndToDates(fromDate, toDate);

  if (isFromAndToValid) {
    const filteredIncomeTransactions = getFilteredTransactions(
      incomeTransactions,
      fromDate,
      toDate
    );
    const filteredExpenseTransactions = getFilteredTransactions(
      expenseTransactions,
      fromDate,
      toDate
    );
    const filteredIncomeDates = filteredIncomeTransactions.map(
      (transaction) => transaction.date
    );
    const filteredExpenseDates = filteredExpenseTransactions.map(
      (transaction) => transaction.date
    );
    const uniqueFilterDates = [
      ...new Set(filteredExpenseDates.concat(filteredIncomeDates)),
    ].sort();

    filterForm.setAttribute("data-filter", "true");
    // FILTERS TRANSACTIONS
    addFilteredTransactionsInList("income-list", filteredIncomeTransactions);
    addFilteredTransactionsInList("expense-list", filteredExpenseTransactions);

    // FILTERS CHART
    filterChartData(uniqueFilterDates);
  }
};

const handleFilterReset = () => {
  const isFilterActive = filterForm.getAttribute("data-filter") === "true";

  if (isFilterActive) {
    filterForm.setAttribute("data-filter", "false");
    addFilteredTransactionsInList("income-list", incomeTransactions);
    addFilteredTransactionsInList("expense-list", expenseTransactions);
    updateChartData();
  }
};
