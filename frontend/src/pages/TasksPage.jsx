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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Task Management</h1>
      <TaskForm
        onCreated={() => setReload(!reload)}
        editingTask={editingTask}
        onFinishEdit={() => setEditingTask(null)}
      />
      <TaskList tasks={tasks} onEdit={setEditingTask} />
    </div>
  );
}
