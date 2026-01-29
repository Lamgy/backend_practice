const express = require("express");
const app = express();
require("dotenv").config();
require("./db");

const Student = require("./models/Student");

app.use(express.json());

app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({}, { name: 1, _id: 0 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/students/filter", async (req, res) => {
  const students = await Student.find({ age: { $gt: 19 } })
    .sort({ age: 1 })
    .limit(2);
  res.json(students);
});

app.put("/api/students/increase-age", async (req, res) => {
  const result = await Student.updateMany(
    { age: { $lt: 19 } },
    { $inc: { age: 1 } }
  );
  res.json(result);
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/students/average-age", async (req, res) => {
  const result = await Student.aggregate([
    { $group: { _id: null, averageAge: { $avg: "$age" } } }
  ]);
  res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

