const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");


const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/userAuth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  subjects: { type: [String], required: true },
  tutors: { type: Map, of: String, required: true },
});
const User = mongoose.model("User", userSchema);

//Tutor schema and model
const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  schedule: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true }, 
      endTime: { type: String, required: true }, 
    },
  ],
});
const Tutor = mongoose.model("Tutor", tutorSchema);

//Marks schema and model
const marksSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  marks: {
    maths: { type: Number, required: true },  
    physics: { type: Number, required: true }, 
    chemistry: { type: Number, required: true },  
  },
});

const Marks = mongoose.model("Marks", marksSchema);

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      dob,
      phone,
      guardianName,
      guardianPhone,
      subjects,
      tutors,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      dob,
      phone,
      guardianName,
      guardianPhone,
      subjects,
      tutors,
    });
    await user.save();
    res.status(201).json({ success: true, message: "Signup successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", userId: user._id, fullName: user.fullName });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//timetable
const isLoggedIn = (req, res, next) => {
  const userId = req.headers.authorization; // Use a token or userId in production
  console.log("Authorization header received:", userId);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  req.userId = userId;
  next();
};
app.get("/timetable", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Fetch tutor details for the user's selected tutors
    const tutorIds = Array.from(user.tutors.values());
    const tutors = await Tutor.find({ name: { $in: tutorIds } });

    // Group schedules by day and sort by time
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
app.get("/marks", async (req, res) => {
  try {
    
    // Fetch the marks for the user
    const marks = await Marks.findOne({ studentName:"Harsh Yadav" });

    if (!marks) {
      return res.status(404).json({ message: "Marks not found for this student" });
    }

    res.json({
      studentName: marks.studentName,
      marks: marks.marks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
