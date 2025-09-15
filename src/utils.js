function decimalToDMS(degrees) {
  const d = Math.floor(degrees);
  const m = Math.floor((degrees - d) * 60);
  const s = ((degrees - d - m / 60) * 3600).toFixed(1);
  return { degrees: d, minutes: m, seconds: s };
}

function formatLatLon(lat, lon) {
  const latDirection = lat >= 0 ? 'N' : 'S';
  const lonDirection = lon >= 0 ? 'E' : 'W';

  // Convert latitude and longitude to degrees, minutes, seconds
  const latDMS = decimalToDMS(Math.abs(lat));
  const lonDMS = decimalToDMS(Math.abs(lon));

  // Return the formatted string
  return `${latDMS.degrees}°${latDMS.minutes}'${latDMS.seconds}"${latDirection} ${lonDMS.degrees}°${lonDMS.minutes}'${lonDMS.seconds}"${lonDirection}`;
}

export { formatLatLon };
