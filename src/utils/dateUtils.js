export const formatDate = (date) => date.toISOString().slice(0, 10);

export const getFiveDayWindow = (centerDate) => {
  const days = [];
  for (let offset = -2; offset <= 2; offset++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + offset);
    days.push(d);
  }
  return days;
};

export const calculateAge = (fechaNacimiento) => {
  if (!fechaNacimiento) return 'N/A';
  try {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad.toString() + " años";
  } catch(e) { 
    console.error("Error calculando edad");
    return 'N/A';
  }
};

export const formatBirthDate = (fechaNacimiento) => {
  if (!fechaNacimiento) return 'N/A';
  try {
    const d = new Date(fechaNacimiento);
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return d.toLocaleDateString('es-ES', options);
  } catch(e) { 
    console.error("Error formateando fecha");
    return 'N/A';
  }
};