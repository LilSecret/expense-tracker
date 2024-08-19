const strDateToJSDate = (date) => {
  const currentYear = new Date().getFullYear();

  return new Date(date + "/" + currentYear).toLocaleDateString("en-US", {
    day: "numeric",
    month: "2-digit",
  });
};
