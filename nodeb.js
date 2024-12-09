const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/userAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

const tutorData = [
  {
    name: "John Smith",
    subject: "Mathematics",
    schedule: [
      { day: "Monday", startTime: "9:00 AM", endTime: "11:00 AM" },
      { day: "Wednesday", startTime: "1:00 PM", endTime: "3:00 PM" },
    ],
  },
  {
    name: "Sarah Johnson",
    subject: "Physics",
    schedule: [
      { day: "Tuesday", startTime: "10:00 AM", endTime: "12:00 PM" },
      { day: "Thursday", startTime: "2:00 PM", endTime: "4:00 PM" },
    ],
  },
  {
    name: "Emily Brown",
    subject: "Chemistry",
    schedule: [
      { day: "Monday", startTime: "11:00 AM", endTime: "1:00 PM" },
      { day: "Friday", startTime: "3:00 PM", endTime: "5:00 PM" },
    ],
  },
];
const insertTutors = async () => {
  try {
    await Tutor.insertMany(tutorData);
    console.log("Tutor records inserted successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting tutor records:", error);
  }
};
insertTutors();
