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

export async function fetchBookingRooms({ signal, categoryId, searchTerm}) {
    console.log(searchTerm);
    console.log(categoryId)
    let url = "http://localhost:8080/bookings/rooms";
  
    if (categoryId && searchTerm) {
      url += "?id=" + categoryId + '&search=' + searchTerm
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
