import {
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILURE,
  UPDATE_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_FAILURE,
  DELETE_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_FAILURE,
  RESET_SUCCESS_STATE,
  FETCH_CATEGORIES_SUCCESS,
  ADD_CATEGORIES_SUCCESS,
  FETCH_TRANSACTIONS_REQUEST,
} from "./actionTypes";

const initialState = {
  transactions: [],
  isFetching: false,
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  categories: [],
  error: null,
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTIONS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        isFetching: false,
        error: null,
      };
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        error: null,
      };
    case ADD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        addSuccess: true,
        error: null,
      };
    case FETCH_TRANSACTIONS_FAILURE:
    case ADD_TRANSACTION_FAILURE:
    case UPDATE_TRANSACTION_FAILURE:
    case DELETE_TRANSACTION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        addSuccess: true,
        error: null,
      };
    case UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
        updateSuccess: true,
        error: null,
      };
    case DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
        deleteSuccess: true,
        error: null,
      };
    case RESET_SUCCESS_STATE:
      return {
        ...state,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
      };
    default:
      return state;
  }
};

export default transactionReducer;
