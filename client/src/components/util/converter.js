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

export function compressQuery(dataArray){
  return dataArray.reduce((acc, current) => {
      const existing = acc.find(item => item.name === current.name);
      if (existing) {
          existing.values.push(current.value);
      } else {
          acc.push({ name: current.name, values: [current.value] });
      }

      return acc;
  }, []);
}