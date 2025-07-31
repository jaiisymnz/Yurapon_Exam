import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // 🔍 Filter states
  const [searchDate, setSearchDate] = useState("");
  const [field, setField] = useState("start_date");
  const [sort, setSort] = useState("asc");

  const fetchTasks = async () => {
    try {
      const params = {};
      if (searchDate) params.date = searchDate;
      if (field) params.field = field;
      if (sort) params.sort = sort;

      const res = await axios.get("http://localhost:3000/api/tasks", { params });
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [reload, searchDate, field, sort]);

  const handleCreated = () => setReload(!reload);
  const handleEdit = (task) => setEditingTask(task);
  const handleFinishEdit = () => setEditingTask(null);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:3000/api/tasks/${id}`);
        alert("✅ Task deleted.");
        setReload(!reload);
      } catch (err) {
        console.error("Delete failed:", err);
        alert("❌ Failed to delete task.");
      }
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold mb-4">Task Management</h1>

      {/* 🔍 Filter section */}
      <div className="space-x-2 mb-4">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border px-2 py-1"
        />
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="start_date">Start Date</option>
          <option value="due_date">Due Date</option>
          <option value="created_at">Created At</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
        <button
          onClick={fetchTasks}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      <TaskForm
        onCreated={handleCreated}
        editingTask={editingTask}
        onFinishEdit={handleFinishEdit}
      />
      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDeleted={handleDelete}
      />
    </div>
  );
}
