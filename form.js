const newExpenseForm = document.querySelector(".new-expense-form");
const expenseFormType = document.querySelector("#list-type");
const expenseFormDescription = document.querySelector("#description");
const expenseFormAmount = document.querySelector("#amount");
const expenseFormErrorMessage = document.querySelector(".form-error-message");

const resetFormValues = () => {
  expenseFormType.value = "default";
  expenseFormDescription.value = "";
  expenseFormAmount.value = "";
  expenseFormErrorMessage.classList.remove("active");
};

const checkFormInputsForError = () => {
  const typeInputError = expenseFormType.value === "default";
  const descriptionError = expenseFormDescription.value.length < 4;
  const amountError = Number(expenseFormAmount.value) <= 0;

  return typeInputError || descriptionError || amountError;
};

const addFormErrorMessage = (message) => {
  expenseFormErrorMessage.classList.add("active");
  expenseFormErrorMessage.innerHTML = message;
};
