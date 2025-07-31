export default function TaskList({ tasks, onEdit, onDeleted }) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="border p-4 rounded">
          <h2 className="text-lg font-semibold">{task.name}</h2>
          <p>Start: {task.start_date}</p>
          <p>Due: {task.due_date}</p>
          <p>Status: <span className="italic">{task.status}</span></p>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="bg-yellow-400 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => onDeleted(task.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
