import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [reload]);

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Task Management</h1>
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
