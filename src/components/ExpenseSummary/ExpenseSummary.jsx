import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarToolTip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import PropTypes from "prop-types";

import {
  calculateTotal,
  groupByCategory,
  groupByMonth,
} from "../../utils/functions";

const ExpenseSummary = ({ transactions }) => {
  const totalIncome = calculateTotal(transactions, "income");
  const totalExpense = calculateTotal(transactions, "expense");

  const totalBalance = totalIncome - totalExpense;
  const categorySummary = groupByCategory(transactions);

  const groupedData = groupByMonth(transactions);

  const chartData = Object.keys(groupedData).map((month) => ({
    month,
    income: groupedData[month].income,
    expense: groupedData[month].expense,
  }));

  return (
    <Paper elevation={2} sx={styles.paperStyle}>
      <Grid container spacing={2}>
        <Grid item md={5.5} sm={12} xs={12}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Divider sx={styles.dividerStyle} />
            <Typography variant="subtitle2">
              Total Balance: {totalBalance.toFixed(2)}
            </Typography>
            <Typography variant="subtitle2">
              Income: {totalIncome.toFixed(2)}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Expense: {totalExpense.toFixed(2)}
            </Typography>
            <Divider />

            <Typography variant="subtitle1">Category Breakdown:</Typography>
            <List dense>
              {Object.entries(categorySummary).map(([category, total]) => (
                <Box key={category}>
                  <ListItem>
                    <ListItemText
                      primary={category}
                      sx={styles.capitalizeStyle}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle2">
                        {total.toFixed(2)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider sx={styles.dividerStyleMx} />
                </Box>
              ))}
            </List>
          </Box>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item md={5.5} sm={12} xs={12} sx={styles.chartStyle}>
          <Typography variant="h6" gutterBottom>
            Income/Expense Trends
          </Typography>

          <Divider sx={styles.dividerStyle} />

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <BarToolTip />
              <Legend />
              <Bar dataKey="income" fill="#8884d8" />
              <Bar dataKey="expense" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

const styles = {
  dividerStyle: {
    mb: 1,
  },
  paperStyle: { padding: "16px", boxSizing: "border-box" },
  capitalizeStyle: {
    textTransform: "capitalize",
  },
  minWidthStyle: {
    minWidth: "100px",
  },
  dividerStyleMx: { mx: 1 },
  chartStyle: {
    ".recharts-wrapper": {
      pointerEvents: "none",
    },
  },
};

ExpenseSummary.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default ExpenseSummary;
