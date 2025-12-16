const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
const PORT = 8000

// ---------- MIDDLEWARE ----------
app.use(cors())
app.use(express.json())

// ---------- MONGODB CONNECTION ----------
mongoose.connect("mongodb://127.0.0.1:27017/todoDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

// ---------- SCHEMA & MODEL ----------
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Todo = mongoose.model("Todo", todoSchema)

// ---------- ROUTES ----------

// ➕ CREATE TODO
app.post("/todos", async (req, res) => {
  try {
    const todo = new Todo(req.body)
    await todo.save()
    res.status(201).json(todo)
  } catch (err) {
    res.status(400).json({ error: "Failed to create todo" })
  }
})

// 📄 GET ALL TODOS
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json(todos)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" })
  }
})

// ✏️ UPDATE TODO
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updatedTodo)
  } catch (err) {
    res.status(400).json({ error: "Failed to update todo" })
  }
})

// 🗑 DELETE TODO
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id)
    res.json({ message: "Todo deleted successfully" })
  } catch (err) {
    res.status(400).json({ error: "Failed to delete todo" })
  }
})

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
