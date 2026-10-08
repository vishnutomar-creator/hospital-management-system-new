const PRESCRIPTION_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const MEDICINE_FREQUENCY = {
  ONCE_DAILY: "once_daily",
  TWICE_DAILY: "twice_daily",
  THREE_TIMES_DAILY: "three_times_daily",
  FOUR_TIMES_DAILY: "four_times_daily",
  AS_NEEDED: "as_needed",
};

const MEDICINE_TIMING = {
  BEFORE_MEAL: "before_meal",
  AFTER_MEAL: "after_meal",
  WITH_MEAL: "with_meal",
  ANYTIME: "anytime",
};

module.exports = {
  PRESCRIPTION_STATUS,
  MEDICINE_FREQUENCY,
  MEDICINE_TIMING,
};