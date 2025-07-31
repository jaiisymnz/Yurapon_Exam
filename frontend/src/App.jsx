import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-6 space-x-4">
          <Link to="/tasks" className="text-blue-600 hover:underline">Tasks</Link>
          <Link to="/reports" className="text-blue-600 hover:underline">Reports</Link>
        </nav>

        <Routes>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
