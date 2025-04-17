import { useEffect, useState } from "react";
import HeaderBar from "../UI/HeaderBar";
import { useQuery } from "@tanstack/react-query";
import { fetchEventCategories, fetchEvents, queryClient } from "../util/http";
import CategoryBar from "../UI/CategoryBar";
import classes from "./styles/eventPage.module.css";
import EmptyState from "../UI/EmptyState";
import LoadingIndicator from "../UI/LoadingIndicator";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../UI/SearchBar";
import Button from "../UI/Button";
import { convertEventTime } from "../util/converter";

export default function EventsPage() {
  const { data: categoryData } = useQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });

  const [activeCategory, setActiveCategory] = useState();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState();

  const navigate = useNavigate();

  function handleRSVPClick(eventid) {
    navigate(eventid)
  }

  function handleOnSearch() {
    setOpenSearch((prevVal) => !prevVal);
  }

  useEffect(() => {
    if (categoryData && !activeCategory && categoryData.length > 0) {
      setActiveCategory(categoryData[0].id);
    }
  }, [activeCategory, categoryData]);

  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
  } = useQuery({
    queryKey: ["events", activeCategory, searchTerm],
    queryFn: ({ signal }) =>
      fetchEvents({
        signal,
        categoryId: activeCategory,
        searchTerm: searchTerm,
      }),
    enabled: !!activeCategory,
  });

  console.log(eventsData);

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
        <main className={classes["event-list"]}>
          {isEventsError ? (
            <EmptyState
              title={"Failed to fetch categories"}
              message={eventsError.info?.message}
            />
          ) : isEventsLoading ? (
            <LoadingIndicator />
          ) : (
            eventsData?.map((event) => {
              return (
                <div key={event.idevent} className={classes["event-item"]}>
                <img className={classes["event-image"]} src={event.eventimage} alt={event.roomName}/>
                  <div className={classes["event-details"]}>
                    <h2 className={classes["event-title"]}>
                      {event.eventname}
                    </h2>
                    <div className={classes["event-subtitle-container"]}>
                      <p className={classes["event-subtitle"]}>
                        {event.roomName} ({event.roomid})
                      </p>
                      <p className={classes["event-subtitle"]}>
                        {convertEventTime(event.eventstart, event.eventend)}
                      </p>
                    </div>
                    <div className={classes["event-bottom-container"]}>
                      <p className={classes["event-description"]}>
                        {event.eventdescription}
                      </p>
                      <Button
                        className="view-event-btn"
                        onClick={() => handleRSVPClick(String(event.idevent))}
                      >
                        VIEW
                      </Button>
                    </div>
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
      <HeaderBar title="Event Calendar System" onSearchClick={handleOnSearch} />
      <SearchBar
        open={openSearch}
        value={searchTerm}
        onChange={setSearchTerm}
        onClose={() => setOpenSearch(false)}
        placeholderMsg="Search Events..."
      />
      {content}
    </>
  );
}

export function loader() {
  return queryClient.fetchQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });
}
