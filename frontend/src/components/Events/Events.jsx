import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import { sortEventsByRelevance } from "../../utils/sortEvents";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const sortedEvents = sortEventsByRelevance(allEvents);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            {!isLoading && sortedEvents && sortedEvents.length !== 0 && (
              <div className="w-full grid">
                {sortedEvents.length !== 0 && (
                  <EventCard data={sortedEvents[0]} />
                )}
                <h4>{sortedEvents?.length === 0 && "No Events have!"}</h4>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
