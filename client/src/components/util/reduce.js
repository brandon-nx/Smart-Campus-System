export function reduceHours(timeStr, hoursToSubtract) {
  // Split the time into components
  const [hh, mm, ss] = timeStr.split(":").map(Number);
  // Convert to total minutes from midnight
  let totalMinutes = hh * 60 + mm;
  // Subtract the hours in minutes
  totalMinutes -= hoursToSubtract * 60;

  // Handle negative values (if desired, for times before midnight)
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  // Convert back to hours and minutes
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;

  // Utility to pad numbers to two digits
  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(newHour)}:${pad(newMinute)}:${pad(ss)}`;
}
