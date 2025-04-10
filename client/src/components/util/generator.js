import { formatDateTo24HourString, parseTimeToDate } from "./converter";

export function generateTimeSlots(openTime, closeTime, incrementMinutes = 30) {
  const startDate = parseTimeToDate(openTime);
  const endDate = parseTimeToDate(closeTime);
  const slots = [];
  let current = new Date(startDate);

  // Generate slots until the current time exceeds the end time
  while (current <= endDate) {
    slots.push(formatDateTo24HourString(current));
    current = new Date(current.getTime() + incrementMinutes * 60000);
  }
  return slots;
}
