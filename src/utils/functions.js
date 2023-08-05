const sortByDate = (data, sortOrder) => {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
};

const calculateTotal = (data, transactionType) => {
  return data
    .filter((transaction) => transaction.transactionType === transactionType)
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
};

const groupByCategory = (data) => {
  const grouped = {};

  data.forEach((transaction) => {
    if (!grouped[transaction.category]) {
      grouped[transaction.category] = 0;
    }
    grouped[transaction.category] += parseFloat(transaction.amount);
  });

  return grouped;
};

const groupByMonth = (data) => {
  const grouped = {};

  data.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!grouped[monthYear]) {
      grouped[monthYear] = {
        income: 0,
        expense: 0,
      };
    }

    if (transaction.transactionType === "expense") {
      grouped[monthYear].expense += parseFloat(transaction.amount);
    } else {
      grouped[monthYear].income += parseFloat(transaction.amount);
    }
  });

  return grouped;
};

export { sortByDate, calculateTotal, groupByMonth, groupByCategory };
