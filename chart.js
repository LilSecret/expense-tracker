const ctx = document.getElementById("myChart");

const removeBtn = document.getElementById("remove-chart");
const addItemBtn = document.getElementById("add-item-chart");
const addTenBtn = document.getElementById("add-ten");

const expenseDateData = [];
const incomeDateData = [];

const getExpenseDates = () =>
  expenseTransactions.map((transaction) => transaction.date);
const getIncomeDates = () =>
  incomeTransactions.map((transaction) => transaction.date);

const getUniqueSortedDates = () => {
  const expenseDates = getExpenseDates();
  const incomeDates = getIncomeDates();

  return [...new Set(expenseDates.concat(incomeDates))].sort();
};

const loadTransactionDataAmount = () => {
  const sortedDates = getUniqueSortedDates();

  sortedDates.forEach((date) => {
    let count = 0;
    expenseTransactions.forEach((transaction) => {
      if (transaction.date === date) {
        count += transaction.amount;
      }
    });
    expenseDateData.push({ date: date, count: count });
  });

  sortedDates.forEach((date) => {
    let count = 0;
    incomeTransactions.forEach((transaction) => {
      if (transaction.date === date) {
        count += transaction.amount;
      }
    });
    incomeDateData.push({ date: date, count: count });
  });

  chart.data.labels = sortedDates;

  updateChartData();
};

const updateChartData = () => {
  chart.data.labels = getUniqueSortedDates();
  chart.data.datasets.forEach((graph) => {
    switch (graph.label) {
      case "Income":
        graph.data = incomeDateData.map((dataDate) => dataDate.count);
        break;
      case "Expenses":
        graph.data = expenseDateData.map((dataDate) => dataDate.count);
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
      incomeDateData.forEach((dateItem) => {
        if (dateItem.date === date) {
          isIncomeDateLogged = true;
          dateItem.count += count;
        }
      });
      if (!isIncomeDateLogged) {
        incomeDateData.push({ date, count });
      }
      break;
    case "expense-list":
      let isExpenseDateLogged = false;
      expenseDateData.forEach((dateItem) => {
        if (dateItem.date === date) {
          isExpenseDateLogged = true;
          dateItem.count += count;
        }
      });
      if (!isExpenseDateLogged) {
        expenseDateData.push({ date, count });
      }
      break;

    default:
      throw new Error("This type does not exist");
  }
};

const handleOtherDateData = (type, date) => {
  switch (type) {
    case "income-list":
      if (!expenseDateData.includes(date)) {
        expenseDateData.push({ date, count: 0 });
      }
      break;
    case "expense-list":
      if (!incomeDateData.includes(date)) {
        incomeDateData.push({ date, count: 0 });
      }
      break;

    default:
      throw new Error("This type of date data does not exist");
  }
};

const addTransactionToChart = (type, date, count) => {
  addCountToDateData(type, date, count);
  handleOtherDateData(type, date);
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
