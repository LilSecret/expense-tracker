const fromFilterInput = document.querySelector("#from");
const toFilterInput = document.querySelector("#to");

const filterMessage = document.querySelector("#filter-error-message");
const filterActions = document.querySelector(".filter-actions");

const toggleFilterValidation = (boolean) => {};

const showFilterError = (message, hideActions) => {
  if (hideActions) {
    filterActions.setAttribute("data-visible", "false");
  }

  filterMessage.innerHTML = message;
  filterMessage.setAttribute("data-visible", "true");
};

const validateFilterDates = (fromDestination) => {
  const storedDates = getUniqueSortedDates(fromDestination);

  if (storedDates.length >= 3) {
    return storedDates;
  }
  showFilterError("Please provide more dates to allow filtering.", true);
};

const createOptionElement = (value, title) => {
  const optionElement = document.createElement("option");
  optionElement.setAttribute("value", value);
  optionElement.innerHTML = title;
  return optionElement;
};

const addDatesToFilterOptions = (dates) => {
  const fromDates = dates.slice(0, -1);
  const toDates = dates.slice(1, dates.length);

  fromFilterInput.innerHTML = `<option value="default" disabled selected>Select a date</option>`;
  toFilterInput.innerHTML = `<option value="default" disabled selected>Select a date</option>`;

  fromDates.forEach((date) => {
    const optionElement = createOptionElement(date, date);
    fromFilterInput.appendChild(optionElement);
  });
  toDates.forEach((date) => {
    const optionElement = createOptionElement(date, date);
    toFilterInput.appendChild(optionElement);
  });
};

const loadDatesIntoFilters = () => {
  const storedDates = validateFilterDates("localStorage");

  if (storedDates) {
    addDatesToFilterOptions(storedDates);
  }
};
