import {
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  ADD_TRANSACTION_REQUEST,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILURE,
  UPDATE_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_FAILURE,
  DELETE_TRANSACTION_REQUEST,
  DELETE_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_FAILURE,
  RESET_SUCCESS_STATE,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_FAILURE,
  ADD_CATEGORIES_REQUEST,
  ADD_CATEGORIES_SUCCESS,
  ADD_CATEGORIES_FAILURE,
} from "./actionTypes";

export const fetchTransactionsRequest = (filter) => ({
  type: FETCH_TRANSACTIONS_REQUEST,
  filter,
});

export const fetchTransactionsSuccess = (transactions) => ({
  type: FETCH_TRANSACTIONS_SUCCESS,
  payload: transactions,
});

export const fetchTransactionsFailure = (error) => ({
  type: FETCH_TRANSACTIONS_FAILURE,
  payload: error,
});

export const addTransactionRequest = (transactionData) => ({
  type: ADD_TRANSACTION_REQUEST,
  payload: transactionData,
});

export const addTransactionSuccess = (transaction) => ({
  type: ADD_TRANSACTION_SUCCESS,
  payload: transaction,
});

export const addTransactionFailure = (error) => ({
  type: ADD_TRANSACTION_FAILURE,
  payload: error,
});

export const updateTransactionRequest = (transactionId, updatedData) => ({
  type: UPDATE_TRANSACTION_REQUEST,
  payload: { transactionId, updatedData },
});

export const updateTransactionSuccess = (updatedTransaction) => ({
  type: UPDATE_TRANSACTION_SUCCESS,
  payload: updatedTransaction,
});

export const updateTransactionFailure = (error) => ({
  type: UPDATE_TRANSACTION_FAILURE,
  payload: error,
});

export const deleteTransactionRequest = (transactionId) => ({
  type: DELETE_TRANSACTION_REQUEST,
  payload: transactionId,
});

export const deleteTransactionSuccess = (transactionId) => ({
  type: DELETE_TRANSACTION_SUCCESS,
  payload: transactionId,
});

export const deleteTransactionFailure = (error) => ({
  type: DELETE_TRANSACTION_FAILURE,
  payload: error,
});

export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = (categories) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const addCategoryRequest = (category) => ({
  type: ADD_CATEGORIES_REQUEST,
  payload: category,
});

export const addCategorySuccess = (transaction) => ({
  type: ADD_CATEGORIES_SUCCESS,
  payload: transaction,
});

export const addCategoryFailure = (error) => ({
  type: ADD_CATEGORIES_FAILURE,
  payload: error,
});

export const resetSuccessState = () => ({
  type: RESET_SUCCESS_STATE,
});
