import { render } from "@testing-library/react";
import EventCard from "./components/Events/EventCard";

test("EventCard does not crash when no event data is provided", () => {
  expect(() => render(<EventCard />)).not.toThrow();
});
