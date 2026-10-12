// Journey observation XP hotfix. Loaded after app.js.
// Preserve the original event scheduling, weather narration and regular flavor rewards.
const avOriginalJourneyFlavor = maybeJourneyFlavor;
maybeJourneyFlavor = function(eventTime = Date.now()) {
  const trip = h?.trip;
  const journalBefore = trip?.journal?.length || 0;
  const occurred = avOriginalJourneyFlavor(eventTime);
  if (!occurred || !trip || h?.trip !== trip) return occurred;
  // Ordinary flavor already awards XP and creates a journal entry.
  // Weather flavor returns early without doing either.
  if ((trip.journal?.length || 0) === journalBefore) {
    const level = Math.max(1, Math.trunc(Number(h.level) || 1));
    const gained = awardXP((d(4) + d(4)) * level);
    journal({time: eventTime, id: "JOURNEY-WEATHER-FLAVOR", type: "Quiet",
      title: "Journey observation", result: "flavor", xp: gained, coins: [0, 0, 0]});
    addlog(`Journey observation: +${gained} XP.`, "Quiet", eventTime);
    save();
  }
  return occurred;
};
