import { useEffect, useState } from "react";
import HeaderBar from "../UI/HeaderBar";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBookingCategories,
  fetchBookingRooms,
  queryClient,
} from "../util/http";
import CategoryBar from "../UI/CategoryBar";
import classes from "./styles/BookingPage.module.css";
import EmptyState from "../UI/EmptyState";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function BookingPage() {
  const { data: categoryData } = useQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });

  const [activeCategory, setActiveCategory] = useState();
  const [searchTerm, setSearchTerm] = useState();

  useEffect(() => {
    if (categoryData && !activeCategory && categoryData.length > 0) {
      setActiveCategory(categoryData[0].id);
    }
  }, [activeCategory, categoryData]);

  const {
    data: roomsData,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
    error: roomsError,
  } = useQuery({
    queryKey: ["bookings", activeCategory, "rooms", searchTerm],
    queryFn: ({ signal }) =>
      fetchBookingRooms({
        signal,
        categoryId: activeCategory,
        searchTerm: searchTerm,
      }),
    enabled: !!activeCategory,
  });

  console.log(roomsData);

  let content;

  if (!categoryData || categoryData.length === 0) {
    content = (
      <EmptyState
        title="No Categories Found!"
        message="Sorry, there are currently no categories to view. Please try again later."
      />
    );
  } else {
    content = (
      <>
        <CategoryBar
          categoryData={categoryData}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <main className={classes["booking-list"]}>
          {isRoomsError ? (
            <EmptyState
              title={"Failed to fetch categories"}
              message={roomsError.info?.message}
            />
          ) : isRoomsLoading ? (
            <LoadingIndicator />
          ) : (
            roomsData?.map((room) => {
              return (
                <div key={room.roomID}>
                  <div className={classes["booking-item"]}>
                    <div className={classes["booking-details"]}>
                      <h2 className={classes["booking-title"]}>
                        {room.roomName}
                      </h2>
                      <p className={classes["booking-subtitle"]}>
                        {room.roomDescription}
                      </p>
                    </div>
                  </div>
                  <div className={classes["booking-arrow"]}>
                    <span className={classes["icon-arrow-right"]}></span>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderBar title="Booking System" onSearch={() => {}} />
      {content}
    </>
  );
}

export function loader() {
  return queryClient.fetchQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });
}
