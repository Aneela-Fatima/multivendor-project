// Puts still-running events ahead of ones that have already ended, and
// within each group shows the most recently started event first — so a
// campaign that's about to finish doesn't bury one that's actively running.
export const sortEventsByRelevance = (events = []) => {
  const now = Date.now();
  return [...events].sort((a, b) => {
    const aActive = new Date(a?.Finish_Date).getTime() > now;
    const bActive = new Date(b?.Finish_Date).getTime() > now;

    if (aActive !== bActive) return aActive ? -1 : 1;

    return new Date(b?.start_Date).getTime() - new Date(a?.start_Date).getTime();
  });
};
