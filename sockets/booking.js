const bookingSocket = io => {
  io.on("connection", socket => {

    socket.on(
      "joinDoctorRoom",
      doctorId => {
        socket.join(doctorId);
      }
    );

  });
};

module.exports = bookingSocket;