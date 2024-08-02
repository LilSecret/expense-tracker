const ctx = document.getElementById("myChart");

const removeBtn = document.getElementById("remove-chart");
const addItemBtn = document.getElementById("add-item-chart");
const addTenBtn = document.getElementById("add-ten");

const expenseChartData = [];
const incomeChartData = [];

const getExpenseDates = () =>
  expenseTransactions.map((transaction) => transaction.date);
const getIncomeDates = () =>
  incomeTransactions.map((transaction) => transaction.date);

const getUniqueSortedDates = () => {
  const expenseDates = getExpenseDates();
  const incomeDates = getIncomeDates();

  return [...new Set(expenseDates.concat(incomeDates))].sort();
};

const loadTransactionChartData = () => {
  const sortedDates = getUniqueSortedDates();

  sortedDates.forEach((date, index) => {
    const incomeTransMatchingDate = incomeTransactions.filter(
      (transaction) => transaction.date === date
    );
    const expenseTransMatchingDate = expenseTransactions.filter(
      (transaction) => transaction.date === date
    );

    const incomeDateTotal = incomeTransMatchingDate.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const expenseDateTotal = expenseTransMatchingDate.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    if (index === 0) {
      incomeChartData.push({ date: date, amount: incomeDateTotal });
      expenseChartData.push({ date: date, amount: expenseDateTotal });
    } else {
      incomeChartData.push({
        date: date,
        amount: incomeChartData[index - 1].amount + incomeDateTotal,
      });
      expenseChartData.push({
        date: date,
        amount: expenseChartData[index - 1].amount + expenseDateTotal,
      });
    }
  });

  updateChartData();
};

const updateChartData = () => {
  chart.data.labels = getUniqueSortedDates();
  chart.data.datasets.forEach((graph) => {
    switch (graph.label) {
      case "Income":
        graph.data = incomeChartData.map((dataDate) => dataDate.amount);
        break;
      case "Expenses":
        graph.data = expenseChartData.map((dataDate) => dataDate.amount);
        break;
      default:
        throw new Error(graph + "does not exist");
    }
  });
  chart.update();
};

const addCountToDateData = (type, date, count) => {
  switch (type) {
    case "income-list":
      let isIncomeDateLogged = false;
      incomeChartData.forEach((dateItem) => {
        if (dateItem.date === date) {
          isIncomeDateLogged = true;
          dateItem.count += count;
        }
      });
      if (!isIncomeDateLogged) {
        incomeChartData.push({ date, count });
      }
      break;
    case "expense-list":
      let isExpenseDateLogged = false;
      expenseChartData.forEach((dateItem) => {
        if (dateItem.date === date) {
          isExpenseDateLogged = true;
          dateItem.count += count;
        }
      });
      if (!isExpenseDateLogged) {
        expenseChartData.push({ date, count });
      }
      break;

    default:
      throw new Error("This type does not exist");
  }
};

const handleOtherDateDataAfterAdd = (type, date) => {
  switch (type) {
    case "income-list":
      let isExpenseDateLogged = false;
      expenseChartData.forEach((graphPoint) => {
        if (graphPoint.date === date) {
          isExpenseDateLogged = true;
        }
      });
      if (!isExpenseDateLogged) {
        expenseChartData.push({ date, count: 0 });
      }
      break;
    case "expense-list":
      let isIncomeDateLogged = false;
      incomeChartData.forEach((graphPoint) => {
        if (graphPoint.date === date) {
          isIncomeDateLogged = true;
        }
      });
      if (!isIncomeDateLogged) {
        incomeChartData.push({ date, count: 0 });
      }
      break;

    default:
      throw new Error("This type of date data does not exist");
  }
};

const addTransactionToChart = (type, date, count) => {
  addCountToDateData(type, date, count);
  handleOtherDateDataAfterAdd(type, date);
  updateChartData();
};

const checkChartDataForErrors = () => {
  const lastExpenseGraphPoint = expenseChartData[expenseChartData.length - 1];
  const lastIncomeGraphPoint = incomeChartData[incomeChartData.length - 1];
  const firstExpenseGraphPoint = expenseChartData[0];
  const firstIncomeGraphPoint = incomeChartData[0];

  if (lastExpenseGraphPoint.count === 0 && lastIncomeGraphPoint.count === 0) {
    expenseChartData.pop();
    incomeChartData.pop();
  }

  if (firstExpenseGraphPoint.count === 0 && firstIncomeGraphPoint.count === 0) {
    expenseChartData.splice(0, 1);
    incomeChartData.splice(0, 1);
  }
};

const removeTransactionFromChart = (type, transaction) => {
  const price = Number(transaction.querySelector(".item-price").innerHTML);
  const date = transaction.querySelector(".item-date").innerHTML;

  switch (type) {
    case "income-list":
      incomeChartData.forEach((graphPoint) => {
        if (graphPoint.date === date) {
          graphPoint.count -= price;
        }
      });
      break;
    case "expense-list":
      expenseChartData.forEach((graphPoint) => {
        if (graphPoint.date === date) {
          graphPoint.count -= price;
        }
      });
      break;

    default:
      throw new Error(type + " does not exist");
  }

  checkChartDataForErrors();
  updateChartData();
};

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [0],
    datasets: [
      {
        label: "Income",
        data: [1000, 200],
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: [340, 120, 300, 100],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
