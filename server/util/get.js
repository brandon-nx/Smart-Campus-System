export function getDayName(bookingDate) {
    const dateObj = new Date(bookingDate);
    const daysOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ]

    return daysOfWeek[dateObj.getDay()];
}