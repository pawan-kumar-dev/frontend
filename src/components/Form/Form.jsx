/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { Formik, Form as FormContainer } from "formik";
import { useEffect, useState } from "react";

import { get } from "../../utils/lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategoryRequest,
  addTransactionRequest,
  resetSuccessState,
  updateTransactionRequest,
} from "../../store/actions";
import {
  RadioInput,
  AutocompleteInput,
  NumberInput,
  TextAreaInput,
} from "./FormElement";
import validationSchema from "../../utils/formValidation";

const Form = ({
  operationType,
  transactionData,
  handleFormClose = () => {},
}) => {
  const [newCategory, setNewCategory] = useState("");

  const operationSuccess = useSelector(
    (state) => get(state, "addSuccess") || get(state, "updateSuccess")
  );

  const categories = useSelector((state) => get(state, "categories", []));

  const dispatch = useDispatch();

  const onSubmit = (values) => {
    if (operationType === "edit")
      dispatch(
        updateTransactionRequest(get(transactionData, "id"), {
          ...transactionData,
          ...values,
        })
      );
    else dispatch(addTransactionRequest(values));
    if (newCategory) {
      const isCategoryAlreadyAdded = (categories || []).find(
        (category) =>
          get(category, "title", "").toLowerCase() === newCategory.toLowerCase()
      );
      if (!isCategoryAlreadyAdded) dispatch(addCategoryRequest(newCategory));
    }
  };

  useEffect(() => {
    if (operationSuccess === true) {
      handleFormClose("close");
      dispatch(resetSuccessState());
    }
  }, [dispatch, operationSuccess]);

  return (
    <Formik
      initialValues={{
        transactionType: get(transactionData, "transactionType", ""),
        category: get(transactionData, "category", ""),
        description: get(transactionData, "description", ""),
        amount: get(transactionData, "amount", ""),
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        touched,
        errors,
        values,
        handleChange,
        setFieldValue,
        setFieldError,
      }) => (
        <FormContainer>
          <RadioInput
            values={values}
            touched={touched}
            errors={errors}
            handleChange={handleChange}
          />
          <AutocompleteInput
            values={values}
            touched={touched}
            errors={errors}
            categories={categories}
            setFieldError={setFieldError}
            setFieldValue={setFieldValue}
            setNewCategory={setNewCategory}
          />
          <NumberInput
            values={values}
            touched={touched}
            errors={errors}
            handleChange={handleChange}
          />
          <TextAreaInput
            values={values}
            touched={touched}
            errors={errors}
            handleChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </FormContainer>
      )}
    </Formik>
  );
};

Form.propTypes = {
  operationType: PropTypes.string.isRequired,
  transactionData: PropTypes.object.isRequired,
  handleFormClose: PropTypes.func,
};

export default Form;
