const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export default function TaskList({ tasks, onEdit, onDeleted }) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="border p-4 rounded">
          <h2 className="text-lg font-semibold">{task.name}</h2>
          <p>Start: {formatDate(task.start_date)}</p>
          <p>Due: {formatDate(task.due_date)}</p>
          <p>Status: <span className="italic">{task.status}</span></p>

          <p className="text-sm text-gray-600">
            Created_at: {formatDate(task.created_at)}
          </p>
          <p className="text-sm text-gray-600">
            Updated_at: {formatDate(task.updated_at)}
          </p>

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
