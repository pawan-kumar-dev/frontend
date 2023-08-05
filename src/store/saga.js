import { put, call, takeEvery, all } from "redux-saga/effects";
import { enqueueSnackbar } from "notistack";
import {
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  addTransactionSuccess,
  addTransactionFailure,
  updateTransactionSuccess,
  updateTransactionFailure,
  deleteTransactionSuccess,
  deleteTransactionFailure,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategorySuccess,
  addCategoryFailure,
} from "./actions";
import {
  FETCH_TRANSACTIONS_REQUEST,
  ADD_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_REQUEST,
  DELETE_TRANSACTION_REQUEST,
  FETCH_CATEGORIES_REQUEST,
  ADD_CATEGORIES_REQUEST,
} from "./actionTypes";
import { categoryRef, db, expenseRef } from "../config/firebaseConfig";
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { get } from "../utils/lodash";
import { getDataFromLocalStorage } from "../utils/localStorage-utils";

function* fetchTransactions(action) {
  const loggedInUserData = getDataFromLocalStorage("loggedInUser");
  let expenseQuery = query(
    expenseRef,
    where("uid", "==", get(loggedInUserData, "uid"))
  );

  if (get(action, "filter.categoriesFilter", []).length) {
    expenseQuery = query(
      expenseRef,
      where("uid", "==", get(loggedInUserData, "uid")),
      where("category", "in", get(action, "filter.categoriesFilter", []))
    );
  }

  try {
    const snapshot = yield call(getDocs, expenseQuery);
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    yield put(fetchTransactionsSuccess(transactions));
  } catch (error) {
    yield put(fetchTransactionsFailure(error.message));
  }
}

function* fetchCategories() {
  let categoryQuery = query(categoryRef);

  try {
    const snapshot = yield call(getDocs, categoryQuery);
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    yield put(fetchCategoriesSuccess(categories));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

function* addCategory(action) {
  try {
    const { payload } = action;
    const newDocRef = yield call(addDoc, categoryRef, {
      title: payload,
    });
    yield put(addCategorySuccess({ id: newDocRef.id, title: payload }));
  } catch (error) {
    let errorMessage = get(error, "message") || "Something went wrong";
    yield put(addCategoryFailure(errorMessage));
  }
}

function* addTransaction(action) {
  try {
    const { payload } = action;
    const loggedInUserData = getDataFromLocalStorage("loggedInUser");
    const newTransactionData = {
      ...payload,
      uid: get(loggedInUserData, "uid"),
      createdAt: `${new Date().toISOString()}`,
    };

    const newDocRef = yield call(addDoc, expenseRef, { ...newTransactionData });
    yield put(
      addTransactionSuccess({ id: newDocRef.id, ...newTransactionData })
    );
    enqueueSnackbar("Transaction added successfully", { variant: "success" });
  } catch (error) {
    let errorMessage = get(error, "message") || "Something went wrong";
    yield put(addTransactionFailure(errorMessage));
    enqueueSnackbar(errorMessage, { variant: "error" });
  }
}

function* updateTransaction(action) {
  try {
    const { transactionId, updatedData } = action.payload;
    const transactionDocRef = doc(db, "expense", transactionId);
    yield call(updateDoc, transactionDocRef, updatedData);
    yield put(updateTransactionSuccess({ id: transactionId, ...updatedData }));
    enqueueSnackbar("Transaction updated successfully", { variant: "success" });
  } catch (error) {
    let errorMessage = get(error, "message") || "Something went wrong";
    yield put(updateTransactionFailure(error.message));
    enqueueSnackbar(errorMessage, { variant: "error" });
  }
}

function* deleteTransaction(action) {
  try {
    const { payload: transactionId } = action;
    const transactionDocRef = doc(db, "expense", transactionId);
    yield call(deleteDoc, transactionDocRef);
    yield put(deleteTransactionSuccess(transactionId));
    enqueueSnackbar("Transaction deleted successfully", {
      variant: "success",
    });
  } catch (error) {
    let errorMessage = get(error, "message") || "Something went wrong";
    yield put(deleteTransactionFailure(error.message));
    enqueueSnackbar(errorMessage, { variant: "error" });
  }
}

export function* watchFetchTransactions() {
  yield takeEvery(FETCH_TRANSACTIONS_REQUEST, fetchTransactions);
}

export function* watchAddTransaction() {
  yield takeEvery(ADD_TRANSACTION_REQUEST, addTransaction);
}

export function* watchUpdateTransaction() {
  yield takeEvery(UPDATE_TRANSACTION_REQUEST, updateTransaction);
}

export function* watchDeleteTransaction() {
  yield takeEvery(DELETE_TRANSACTION_REQUEST, deleteTransaction);
}

export function* watchFetchCategories() {
  yield takeEvery(FETCH_CATEGORIES_REQUEST, fetchCategories);
}

export function* watchAddCategories() {
  yield takeEvery(ADD_CATEGORIES_REQUEST, addCategory);
}

export default function* rootSaga() {
  yield all([
    watchFetchTransactions(),
    watchAddTransaction(),
    watchUpdateTransaction(),
    watchDeleteTransaction(),
    watchFetchCategories(),
    watchAddCategories(),
  ]);
}
