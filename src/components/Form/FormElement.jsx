import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { get } from "../../utils/lodash";

const filter = createFilterOptions();

const RadioInput = ({ values, handleChange, touched, errors }) => {
  return (
    <FormControl sx={styles.formControl}>
      <FormLabel>Transaction Type</FormLabel>
      <RadioGroup
        name="transactionType"
        value={values.transactionType}
        onChange={handleChange}
        sx={styles.widthStyle}
      >
        <FormControlLabel value="income" control={<Radio />} label="Income" />
        <FormControlLabel value="expense" control={<Radio />} label="Expense" />
      </RadioGroup>
      {touched.transactionType && errors.transactionType ? (
        <FormHelperText error={true}>
          <ErrorMessage name="transactionType" />
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

const AutocompleteInput = ({
  values,
  setFieldError,
  setFieldValue,
  setNewCategory,
  categories,
  touched,
  errors,
}) => {
  return (
    <FormControl sx={styles.formControl}>
      <Field
        as={Autocomplete}
        value={values.category}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setFieldValue("category", newValue);
          } else if (newValue && get(newValue, "inputValue")) {
            setFieldValue("category", get(newValue, "inputValue"));
            setNewCategory(get(newValue, "inputValue"));
          } else setFieldValue("category", get(newValue, "title"));
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some(
            (option) => inputValue === get(option, "title")
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        onBlur={(event) => {
          if (!get(event, "target.value")) {
            setFieldValue("category", "");
            setFieldError("category", "Category is required");
          }
        }}
        options={categories || []}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          if (get(option, "inputValue")) {
            return get(option, "inputValue");
          }
          return get(option, "title");
        }}
        renderOption={(props, option) => (
          <li {...props}>{get(option, "title")}</li>
        )}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Select Category" />
        )}
      />
      {touched.category && errors.category ? (
        <FormHelperText error={true}>
          <ErrorMessage name="category" />
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

const NumberInput = ({ values, handleChange, touched, errors }) => {
  return (
    <Field
      sx={styles.formControl}
      as={TextField}
      label="Amount"
      name="amount"
      margin="normal"
      fullWidth
      value={values.amount}
      variant="outlined"
      onChange={handleChange}
      error={!!(touched.amount && errors.amount)}
      helperText={<ErrorMessage name="amount" />}
    />
  );
};

const TextAreaInput = ({ values, handleChange, touched, errors }) => {
  return (
    <Field
      sx={{
        ...styles.formControl,
        mb: 2,
      }}
      as={TextField}
      label="Description"
      name="description"
      variant="outlined"
      margin="normal"
      multiline
      fullWidth
      rows={4}
      maxRows={4}
      value={values.description}
      onChange={handleChange}
      error={!!(touched.description && errors.description)}
      helperText={<ErrorMessage name="description" />}
    />
  );
};

const commonPropTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

TextAreaInput.propTypes = commonPropTypes;

NumberInput.propTypes = commonPropTypes;

RadioInput.propTypes = commonPropTypes;

AutocompleteInput.propTypes = {
  values: PropTypes.object.isRequired,
  setFieldError: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setNewCategory: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const styles = {
  formControl: {
    display: "flex",
    flexDirection: "column",
    mt: 1,
    mb: 0,
  },
  widthStyle: { width: "fit-content" },
};

export { RadioInput, AutocompleteInput, NumberInput, TextAreaInput };
