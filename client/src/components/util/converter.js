function ordinal(n) {
  const mod10 = n % 10,
    mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return n + "st";
  if (mod10 === 2 && mod100 !== 12) return n + "nd";
  if (mod10 === 3 && mod100 !== 13) return n + "rd";
  return n + "th";
}

export function convertEventTimeToDateLabel(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function convertEventTimeToDateOnly(
  isoString,
  locale = "en-GB",
  tz = "Asia/Kuala_Lumpur"
) {
  const d = new Date(isoString);
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  });
}

export function convertEventTimeToTimeOnly(
  startIso,
  endIso,
  locale = "en-GB",
  tz = "Asia/Kuala_Lumpur"
) {
  const opts = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  };

  const tidy = (t) => t.replace(/\s/g, ""); // remove space before AM/PM

  const start = tidy(new Date(startIso).toLocaleTimeString(locale, opts));
  const end = tidy(new Date(endIso).toLocaleTimeString(locale, opts));

  return `${start} - ${end}`;
}

export function convertEventTime(
  startIso,
  endIso,
  locale = "en-GB",
  tz = "Asia/Kuala_Lumpur"
) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  // Date part: "5th May 2025"
  const datePart =
    `${ordinal(start.getDate())} ` +
    start.toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
      timeZone: tz,
    });

  // Time part: "6:00 PM - 7:00 PM"
  const opts = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  };
  const timePart = `${start.toLocaleTimeString(
    locale,
    opts
  )} - ${end.toLocaleTimeString(locale, opts)}`;

  return `${datePart} | ${timePart}`;
}

export function convert24To12(timeStr) {
  const [hours, minutes] = timeStr.split(":");

  let hoursNum = parseInt(hours, 10);

  const amOrPm = hoursNum >= 12 ? "PM" : "AM";

  hoursNum = hoursNum % 12 || 12;

  return `${hoursNum}:${minutes} ${amOrPm}`;
}

export function parseTimeToDate(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

export function formatDateTo24HourString(date) {
  const pad = (num) => num.toString().padStart(2, "0");
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

export function convertDateTimeToDateOnly(isoString) {
  const date = new Date(isoString);

  return isNaN(date) ? "" : date.toISOString().substring(0, 10);
}

export function compressQuery(dataArray) {
  return dataArray.reduce((acc, current) => {
    const existing = acc.find((item) => item.name === current.name);
    if (existing) {
      existing.values.push(current.value);
    } else {
      acc.push({ name: current.name, values: [current.value] });
    }

    return acc;
  }, []);
}

export function convertImageFilePathToName(path) {
  if (path) {
    const parts = path.split("/");
    return parts.pop();
  }
  return null;
}
