export function addHours(timeStr, hoursToAdd) {
  // Split the time string into hours, minutes, and seconds
  const [hh, mm, ss] = timeStr.split(":").map(Number);
  // Convert the time into total minutes since midnight
  let totalMinutes = hh * 60 + mm;
  // Add the hours in minutes
  totalMinutes += hoursToAdd * 60;

  // Convert back to hours and minutes
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;

  // Pad the hour and minute values to always show two digits
  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(newHour)}:${pad(newMinute)}:${pad(ss)}`;
}
