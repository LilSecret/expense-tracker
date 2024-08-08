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

const addGraphPointAmount = (chartData, date, amount) => {
  chartData.forEach((dateItem) => {
    if (dateItem.date === date) {
      dateItem.amount += amount;
      return;
    }
  });

  const prevSibling = chartData[chartData.length - 1] || null;
  chartData.push({
    date,
    amount: prevSibling ? prevSibling.amount + amount : amount,
  });
};

const addCountToDateData = (type, date, amount) => {
  switch (type) {
    case "income-list":
      addGraphPointAmount(incomeChartData, date, amount);
      break;
    case "expense-list":
      addGraphPointAmount(expenseChartData, date, amount);
      break;

    default:
      throw new Error("This type does not exist");
  }
};

const handleOpposingGraphPoint = (chartData, date) => {
  chartData.forEach((graphPoint) => {
    if (graphPoint.date === date) {
      return;
    }
  });

  // add previous point or 0
  const prevSibling = chartData[chartData.length - 1] || null;
  chartData.push({
    date,
    amount: prevSibling ? prevSibling.amount : 0,
  });
};

const handleOtherDateDataAfterAdd = (type, date) => {
  switch (type) {
    case "income-list":
      handleOpposingGraphPoint(expenseChartData, date);
      break;
    case "expense-list":
      handleOpposingGraphPoint(incomeChartData, date);
      break;

    default:
      throw new Error("This type of date data does not exist");
  }
};

const addTransactionToChart = (type, transaction) => {
  const { date, amount } = transaction;

  addCountToDateData(type, date, amount);
  handleOtherDateDataAfterAdd(type, date);
  updateChartData();
};

const checkChartDataForErrors = () => {
  const lastExpenseGraphPoint = expenseChartData[expenseChartData.length - 1];
  const lastIncomeGraphPoint = incomeChartData[incomeChartData.length - 1];
  const firstExpenseGraphPoint = expenseChartData[0];
  const firstIncomeGraphPoint = incomeChartData[0];

  if (lastExpenseGraphPoint.amount === 0 && lastIncomeGraphPoint.amount === 0) {
    expenseChartData.pop();
    incomeChartData.pop();
  }

  if (
    firstExpenseGraphPoint.amount === 0 &&
    firstIncomeGraphPoint.amount === 0
  ) {
    expenseChartData.splice(0, 1);
    incomeChartData.splice(0, 1);
  }
};

const removeGraphAmount = (chartData, date, amount) => {
  let matchedDate = false;
  chartData.forEach((graphPoint) => {
    if (graphPoint.date === date || matchedDate) {
      matchedDate = true;
      graphPoint.amount -= amount;
    }
  });
};

const removeTransactionFromChart = (type, transaction) => {
  const { date, amount } = transaction;

  switch (type) {
    case "income-list":
      removeGraphAmount(incomeChartData, date, amount);
      break;
    case "expense-list":
      removeGraphAmount(expenseChartData, date, amount);
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
