exports.getDate = (date) => {
  let weeks = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
  let dates = {
    day: weeks[date.getDay()],
    date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    hour: `${date.getHours()}:${date.getMinutes()}`,
  };
  return dates;
};
