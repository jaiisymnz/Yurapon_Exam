import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ onCreated, editingTask, onFinishEdit }) {
  const [form, setForm] = useState({
    type: 1,
    name: "",
    start_date: "",
    due_date: "",
    status: "in_progress",
  });

  const [types, setTypes] = useState([]);

  // ✅ ตั้งค่า form ใหม่เมื่อ editingTask เปลี่ยน
  useEffect(() => {
    if (editingTask) {
      setForm({
        ...editingTask,
        start_date: editingTask.start_date?.split("T")[0],
        due_date: editingTask.due_date?.split("T")[0],
      });
    }
  }, [editingTask]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/types")
      .then((res) => setTypes(res.data))
      .catch((err) => console.error("Failed to load types:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start_date" || name === "due_date") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      start_date: form.start_date + "T09:00",
      due_date: form.due_date + "T09:00",
    };

    try {
      if (form.id) {
        // 🛠 PUT สำหรับอัปเดต
        await axios.put(`http://localhost:3000/api/tasks/${form.id}`, payload);
        alert("✅ Task updated successfully!");
      } else {
        // 🛠 POST สำหรับสร้างใหม่
        await axios.post("http://localhost:3000/api/tasks", payload);
        alert("✅ Task created successfully!");
      }

      setForm({
        type: 1,
        name: "",
        start_date: "",
        due_date: "",
        status: "in_progress",
      });

      onCreated();
      if (onFinishEdit) onFinishEdit(); // รีเซ็ต edit mode
    } catch (err) {
      console.error("Error submitting task:", err);
      alert("❌ Failed to submit task.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <select name="type" className="border p-2 w-full" value={form.type} onChange={handleChange}>
        {types.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <input
        type="text"
        name="name"
        placeholder="Task name"
        className="border p-2 w-full"
        value={form.name}
        onChange={handleChange}
        required
      />

      <div className="flex gap-2">
        <input
          type="date"
          name="start_date"
          className="border p-2 w-full"
          value={form.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="due_date"
          className="border p-2 w-full"
          value={form.due_date}
          onChange={handleChange}
          required
        />
      </div>

      <select name="status" className="border p-2 w-full" value={form.status} onChange={handleChange}>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
        <option value="cancel">Cancel</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {form.id ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
