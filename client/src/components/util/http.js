import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchBookingCategories({ signal }) {
  let url = "http://localhost:8080/bookings/categories";

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the booking categories"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
}

export async function fetchBookingRooms({ signal, categoryId, searchTerm }) {
  console.log(searchTerm);
  console.log(categoryId);
  let url = "http://localhost:8080/bookings/rooms";

  if (categoryId && searchTerm) {
    url += "?id=" + categoryId + "&search=" + searchTerm;
  } else if (categoryId) {
    url += "?id=" + categoryId;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the rooms");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
}

export async function fetchBookingRoom({ id, signal }) {
  const response = await fetch(`http://localhost:8080/bookings/rooms/${id}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the room");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
}

export async function fetchBookingStartSlots({ id, signal, bookingDate }) {
  const response = await fetch(
    `http://localhost:8080/bookings/rooms/${id}/start-slots?date=${bookingDate}`,
    {
      signal,
    }
  );

  if (response.status === 422) {
    return await response.json();
  }

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the start time slots"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
}

export async function fetchBookingEndSlots({
  id,
  signal,
  bookingDate,
  startTime,
}) {
  const response = await fetch(
    `http://localhost:8080/bookings/rooms/${id}/end-slots?date=${bookingDate}&start=${startTime}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the end time slots"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
}

  //event items below
  export async function bookEventID({ eventData, signal }) {
    const response = await fetch(`http://localhost:8080/events/rsvp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData), // Ensure data is stringified
      signal: signal
  }
);
    if (!response.ok) {
      const error = new Error("An error occurred while fetching the room");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const data = await response.json();
  
    return data;
  }

  export async function fetchEventCategories({ id, signal }) {
    const response = await fetch(`http://localhost:8080/events/categories`, {signal:signal});
  
    if (!response.ok) {
      const error = new Error("An error occurred while fetching the room");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const data = await response.json();
  
    return data;
  }
  
  export async function fetchEvents({ signal, categoryId }) {
    let url = "http://localhost:8080/events/all";
    console.log(categoryId)
    if (categoryId) {
        url += "?id=" + categoryId; // Append categoryId if it exists
    }
    console.log(url)
    const response = await fetch(url, { signal: signal }); // Fetch the data

    if (!response.ok) { // Check if the response is okay
        const error = new Error("An error occurred while fetching the events");
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the data
  }