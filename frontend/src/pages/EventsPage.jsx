import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import EventCard from "../components/Events/EventCard";

const EventsPage = () => {
  const { allEvents = [], isLoading } = useSelector((state) => state.events);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Header activeHeading={4} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="py-10 text-center text-lg font-medium text-gray-600">
            Loading events...
          </div>
        ) : allEvents && allEvents.length > 0 ? (
          <div className="space-y-6">
            {allEvents.map((event) => (
              <EventCard key={event._id} active={true} data={event} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-lg font-medium text-gray-600">
            No events available.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
