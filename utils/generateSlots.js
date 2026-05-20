const generateSlots = (startTime, endTime, slotDuration) => {
  const slots = [];

  const start = new Date(`2000-01-01 ${startTime}`);

  const end = new Date(`2000-01-01 ${endTime}`);

  while (start < end) {
    const slotStart = new Date(start);

    const next = new Date(start);
    next.setMinutes(next.getMinutes() + slotDuration);

    if (next > end) break;

    slots.push({
      startTime: slotStart.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      endTime: next.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      isBooked: false,
    });

    start.setMinutes(start.getMinutes() + slotDuration);
  }

  return slots;
};

module.exports = generateSlots;
