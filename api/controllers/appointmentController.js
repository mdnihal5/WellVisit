const Appointment = require("../models/appointment");
const User = require("../models/User");

// Create new appointment
const createAppointment = async (req, res) => {
  const { doctorId, patientId, appointmentDate, status } = req.body;
  console.log(doctorId,patientId,"req body",req.body)
  try {
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);
   
    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or Patient not found" });
    }

    const newAppointment = new Appointment({
      doctorId,
      patientId,
      doctorName: doctor.name,
      patientName: patient.name,
      appointmentDate,
      status,
    });

    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Appointment created", appointment: newAppointment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating appointment", error: err.message });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err.message });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { doctorId, patientId, appointmentDate, status } = req.body;

  try {
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or Patient not found" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        doctorId,
        patientId,
        doctorName: doctor.name,
        patientName: patient.name,
        appointmentDate,
        status,
      },
      { new: true },
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment updated",
      appointment: updatedAppointment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: err.message });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await Appointment.findByIdAndDelete(id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting appointment", error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
