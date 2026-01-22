const express = require("express");
const app = express();
require("./db");

const Student = require("./models/Student");

app.use(express.json());

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({}, { name: 1, _id: 0 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/students/filter", async (req, res) => {
  const students = await Student.find({ age: { $gt: 19 } })
    .sort({ age: 1 })
    .limit(2);
  res.json(students);
});

app.put("/students/increase-age", async (req, res) => {
  const result = await Student.updateMany(
    { age: { $lt: 19 } },
    { $inc: { age: 1 } }
  );
  res.json(result);
});

app.get("/students/average-age", async (req, res) => {
  const result = await Student.aggregate([
    { $group: { _id: null, averageAge: { $avg: "$age" } } }
  ]);
  res.json(result);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

