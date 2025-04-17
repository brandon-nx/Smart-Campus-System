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
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchBar from "../UI/SearchBar";

export default function BookingPage() {
  const { data: categoryData } = useQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });

  const [activeCategory, setActiveCategory] = useState();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState();

  function handleOnSearch() {
    setOpenSearch((prevVal) => !prevVal);
  }

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
                <div key={room.roomID} className={classes["booking-item"]}>
                  <div className={classes["booking-details"]}>
                    <h2 className={classes["booking-title"]}>
                      {room.roomName}
                    </h2>
                    <p className={classes["booking-subtitle"]}>
                      {room.roomDescription}
                    </p>
                  </div>
                  <Link
                    to={room.roomID}
                    className={classes["booking-arrow-button"]}
                  >
                    <FaArrowRight size={20} color="#f9f9f9" />
                  </Link>
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
      <HeaderBar title="Booking System" onSearchClick={handleOnSearch} />
      <SearchBar
        open={openSearch}
        value={searchTerm}
        onChange={setSearchTerm}
        onClose={() => setOpenSearch(false)}
      />
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
