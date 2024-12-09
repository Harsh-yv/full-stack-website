const express = require("express");
const mongoose = require("mongoose");
const Tutor = require("./path-to-tutor-model"); 
const User = require("./path-to-user-model"); 

const isLoggedIn = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  const userId = req.headers.authorization; 
  req.userId = userId;
  next();
};
app.get("/timetable", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const tutorIds = Array.from(user.tutors.keys());
    const tutors = await Tutor.find({ _id: { $in: tutorIds } });
    const timetable = {};
    for (let day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
      timetable[day] = tutors
        .flatMap(tutor => tutor.schedule.filter(s => s.day === day).map(s => ({ ...s, tutorName: tutor.name, subject: tutor.subject })))
        .sort((a, b) => new Date(`1970/01/01 ${a.startTime}`) - new Date(`1970/01/01 ${b.startTime}`));
    }

    res.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
