import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  transactionType: Yup.string().required("Transaction Type is required"),
  category: Yup.string().required("Category is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});

export default validationSchema;
