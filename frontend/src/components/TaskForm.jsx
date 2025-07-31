import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ onCreated }) {
  const [form, setForm] = useState({
    type: 1,
    name: "",
    start_date: "",
    due_date: "",
    status: "in_progress",
  });

  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/types")
      .then((res) => {
        // console.log("Fetched types:", res.data);
        setTypes(res.data);
      })
      .catch((err) => console.error("Failed to load types:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_date" || name === "due_date") {
      const updatedValue = `${value}T09:00`;
      setForm({ ...form, [name]: updatedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/tasks", form);
      setForm({
        type: 1,
        name: "",
        start_date: "",
        due_date: "",
        status: "in_progress",
      });
      onCreated();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <select
        name="type"
        className="border p-2 w-full"
        value={form.type}
        onChange={handleChange}
      >
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
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
          value={form.start_date ? form.start_date.split("T")[0] : ""}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="due_date"
          className="border p-2 w-full"
          value={form.due_date ? form.due_date.split("T")[0] : ""}
          onChange={handleChange}
          required
        />
      </div>

      <select
        name="status"
        className="border p-2 w-full"
        value={form.status}
        onChange={handleChange}
      >
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
        <option value="cancel">Cancel</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Task
      </button>
    </form>
  );
}
