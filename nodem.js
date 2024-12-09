const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/userAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
const marksSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    marks: {
      maths: { type: Number, required: true },  
      physics: { type: Number, required: true }, 
      chemistry: { type: Number, required: true },  
    },
  });
const Marks = mongoose.model("Marks", marksSchema);
const marks = [
  {
    studentName: "Harsh Yadav",
    marks: {
      maths: "86",  
      physics: "57", 
      chemistry:"75",  
    },
    },
];

// Insert records
const insertMarks = async () => {
  try {
    await Marks.insertMany(marks);
    console.log("Tutor records inserted successfully!");
    mongoose.disconnect(); 
  } catch (error) {
    console.error("Error inserting tutor records:", error);
  }
};
insertMarks();
