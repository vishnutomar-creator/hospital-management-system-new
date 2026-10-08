const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

const isSameDay = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

module.exports = {
  formatDate,
  formatDateTime,
  isSameDay,
};
