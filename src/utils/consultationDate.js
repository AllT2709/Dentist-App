exports.getDate = (date) => {
  let weeks = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
  let dates = {
    day: weeks[date.getDay()],
    date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    hour: `${date.getHours()}:${date.getMinutes()}`,
  };
  return dates;
};

exports.formatDate = (date) => {
  let month = date.getMonth() + 1;
  let newDate = {
    month: month < 10 ? `0${month}` : `${month}`,
    day: date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`,
  };
  return newDate;
};
