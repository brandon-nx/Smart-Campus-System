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

  // Admin Dashboard Functions
  //display functions
  export async function fetchRoomsBookingCount({ signal }) {
    let url = "http://localhost:8080/admin/roombookingsync";

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

  export async function fetchEventsCount({ signal }) {
    let url = "http://localhost:8080/admin/eventbookingsync";

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

  export async function fetchAttendanceCount({ signal }) {
    let url = "http://localhost:8080/admin/attendancesync";

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
  
  export async function fetchEventCategories({ signal }) {
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
  export async function fetchRoomIDs({ signal }) {
    const response = await fetch(`http://localhost:8080/bookings/ids`, {signal:signal});
  
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
  
// Data modification functions
export async function postAnnouncement({ signal, data }) {
  try {
      const res = await fetch("http://localhost:8080/admin/postAnnouncement", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // Ensure data is stringified
          signal: signal
      });

      // Handle response status
      if (res.status === 400 || res.status === 401) {
          const errorResponse = await res.json(); // Parse the error response
          return { success: false, error: errorResponse }; // Return error details
      }

      if (!res.ok) {
          const errorResponse = await res.json(); // Parse the error response
          throw new Response(
              { message: errorResponse.message || "Something is wrong, authentication failed." },
              { status: res.status }
          );
      }

      const responseData = await res.json(); // Parse the successful response
      return { success: true, data: responseData }; // Return success data

  } catch (error) {
      throw new Response(
          { message: error.message || "An unexpected error occurred." },
          { status: 500 }
      );
  }
}
export async function addNewRoom({ signal, data }) {
  try {
      const res = await fetch("http://localhost:8080/admin/addNewRoom", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // Ensure data is stringified
          signal: signal
      });

      // Handle response status
      if (res.status === 400 || res.status === 401) {
          const errorResponse = await res.json(); // Parse the error response
          return { success: false, error: errorResponse }; // Return error details
      }

      if (!res.ok) {
          const errorResponse = await res.json(); // Parse the error response
          throw new Response(
              { message: errorResponse.message || "Something is wrong, authentication failed." },
              { status: res.status }
          );
      }

      const responseData = await res.json(); // Parse the successful response
      return { success: true, data: responseData }; // Return success data

  } catch (error) {
      throw new Response(
          { message: error.message || "An unexpected error occurred." },
          { status: 500 }
      );
  }
}
export async function addNewEvent({ signal, data }) {
  try {
      const res = await fetch("http://localhost:8080/admin/addNewEvent", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // Ensure data is stringified
          signal: signal
      });

      // Handle response status
      if (res.status === 400 || res.status === 401) {
          const errorResponse = await res.json(); // Parse the error response
          return { success: false, error: errorResponse }; // Return error details
      }

      if (!res.ok) {
          const errorResponse = await res.json(); // Parse the error response
          throw new Response(
              { message: errorResponse.message || "Something is wrong, authentication failed." },
              { status: res.status }
          );
      }

      const responseData = await res.json(); // Parse the successful response
      return { success: true, data: responseData }; // Return success data

  } catch (error) {
      throw new Response(
          { message: error.message || "An unexpected error occurred." },
          { status: 500 }
      );
  }
}
