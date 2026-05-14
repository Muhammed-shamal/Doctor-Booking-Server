const generateSlots = (
  startTime,
  endTime,
  slotDuration
) => {
  const slots = [];

  const start = new Date(
    `2000-01-01 ${startTime}`
  );

  const end = new Date(
    `2000-01-01 ${endTime}`
  );

  while (start < end) {
    const slotStart = new Date(start);

    start.setMinutes(
      start.getMinutes() + slotDuration
    );

    const slotEnd = new Date(start);

    slots.push({
      startTime: slotStart.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),

      endTime: slotEnd.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),

      isBooked: false
    });
  }

  return slots;
};

module.exports = generateSlots;