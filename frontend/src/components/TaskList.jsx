import { useState } from "react";

export default function TaskList({ tasks, onEdit }) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="border p-4 rounded">
          <h2 className="font-bold text-lg">{task.name}</h2>
          <p>Start: {task.start_date}</p>
          <p>Due: {task.due_date}</p>
          <p>Status: <span className="italic">{task.status}</span></p>
          <button
            className="mt-2 text-sm text-blue-600 underline"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
}
