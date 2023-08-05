/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Box,
  Button,
  Divider,
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Create as CreateIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

import { get } from "../../utils/lodash";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteTransactionRequest,
  fetchCategoriesRequest,
  fetchTransactionsRequest,
  resetSuccessState,
} from "../../store/actions";

import Form from "../Form";
import Modal from "../Model";

import { sortByDate } from "../../utils/functions";

import ExpenseSummary from "../ExpenseSummary";

import TableHeader from "./TableHeader";

import TableToolbar from "./TableToolbar";

const Table = () => {
  const [modelDetail, setModelDetail] = useState({
    isModelOpen: false,
    operationType: "",
  });

  const [editTransactionDetail, setEditTransactionDetail] = useState({
    transactionType: "",
    category: "",
    description: "",
    amount: "",
  });

  const [categoriesFilter, setCategoriesFilter] = useState([]);

  const dispatch = useDispatch();
  const {
    transactions,
    deleteSuccess: operationSuccess,
    isFetching: isTransactionFetching,
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchTransactionsRequest({}));
    dispatch(fetchCategoriesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (operationSuccess === true) {
      handleModelClick("close");
      dispatch(resetSuccessState());
    }
  }, [dispatch, operationSuccess]);

  const handleModelClick = (eventType, editData) => {
    let operationType = "";
    if (eventType === "close") {
      operationType = "";
      setEditTransactionDetail({
        transactionType: "",
        category: "",
        description: "",
        amount: "",
      });
    }
    if (eventType === "add") operationType = "add";
    if (eventType === "edit" || eventType === "delete") {
      operationType = eventType;
      setEditTransactionDetail(editData);
    }
    setModelDetail((prevState) => ({
      ...prevState,
      isModelOpen: !prevState.isModelOpen,
      operationType,
    }));
  };

  const getModelTitle = () =>
    `${get(modelDetail, "operationType", "")} Transaction`;

  const handleDeleteTransaction = () =>
    dispatch(deleteTransactionRequest(get(editTransactionDetail, "id")));

  const handleCategorySelect = (category = "") => {
    const isAlreadyAdded = categoriesFilter.find(
      (cat) => cat.toLowerCase() === category.toLowerCase()
    );
    let newCategoriesArray = [];
    if (!isAlreadyAdded) {
      newCategoriesArray = [...categoriesFilter, category];
    } else {
      newCategoriesArray = [...categoriesFilter].filter(
        (cat) => cat.toLowerCase() !== category.toLowerCase()
      );
    }
    setCategoriesFilter(newCategoriesArray);
  };

  if (isTransactionFetching) return null;

  return (
    <Box sx={styles.container}>
      <Modal
        isModelOpen={modelDetail.isModelOpen}
        modelTitle={(modelDetail.isModelOpen && getModelTitle()) || ""}
        handleModelClick={handleModelClick}
      >
        {modelDetail.isModelOpen &&
        get(modelDetail, "operationType") !== "delete" ? (
          <Form
            operationType={get(modelDetail, "operationType")}
            handleFormClose={handleModelClick}
            transactionData={editTransactionDetail}
          />
        ) : (
          <Box>
            <Typography
              sx={styles.deleteText}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Are you sure, you want to delete this transaction ?
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteTransaction}
            >
              Delete
            </Button>
          </Box>
        )}
      </Modal>
      <Paper sx={styles.tableContainer}>
        <TableToolbar
          handleModelClick={handleModelClick}
          categoriesFilter={categoriesFilter}
          handleCategorySelect={handleCategorySelect}
        />
        {transactions && transactions.length ? (
          <ExpenseSummary transactions={transactions || []} />
        ) : null}
        <Divider />
        {transactions && transactions.length ? (
          <>
            <Toolbar sx={styles.tableToolbar}>
              <Typography variant="h6" id="tableTitle" component="div">
                Transactions
              </Typography>
            </Toolbar>
            <TableContainer>
              <MuiTable
                sx={styles.table}
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <TableHeader />
                <TableBody>
                  {sortByDate(transactions, "desc").map(
                    (transaction, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={transaction.id}
                          sx={styles.tableRow}
                        >
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={styles.capitalizeStyle}
                          >
                            {transaction.transactionType}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={styles.tableCell("200px", true)}
                          >
                            {transaction.category}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={styles.tableCell("300px")}
                          >
                            {transaction.description}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={styles.tableCell("150px")}
                          >
                            {transaction.amount}
                          </TableCell>
                          <TableCell align="left">
                            {get(transaction, "createdAt")
                              ? new Date(
                                  get(transaction, "createdAt")
                                ).toLocaleDateString()
                              : ""}
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            sx={styles.minWidthStyle}
                          >
                            <IconButton
                              onClick={() =>
                                handleModelClick("edit", transaction)
                              }
                            >
                              <CreateIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleModelClick("delete", transaction)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </>
        ) : (
          <Paper>
            <Typography
              sx={styles.emptyView}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              <ErrorIcon />
              No Transaction Found!
            </Typography>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "90vh",
  },
  deleteText: { flex: "1 1 100%", mb: 1 },
  tableContainer: { width: "100%", mb: 2, height: "100%", overflowY: "scroll" },
  tableToolbar: {
    px: { sm: 1, xs: 1 },
    ...{
      bgcolor: (theme) =>
        alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
    },
    display: "flex",
    flexDirection: { md: "row", sm: "column", xs: "column" },
    justifyContent: {
      md: "flex-start",
      sm: "center",
      xs: "center",
    },
    alignItems: {
      md: "center",
      sm: "flex-start",
      xs: "flex-start",
    },
  },
  table: { minWidth: 750 },
  tableRow: { cursor: "pointer" },
  emptyView: {
    flex: "1 1 100%",
    mb: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell: (width, addCapitalStyle) => ({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: width,
    textTransform: addCapitalStyle ? "capitalize" : "",
  }),
  capitalizeStyle: {
    textTransform: "capitalize",
  },
  minWidthStyle: {
    minWidth: "100px",
  },
};

export default Table;
