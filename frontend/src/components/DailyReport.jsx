import { useEffect, useState } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard";

export default function DailyReportPage() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/reports/daily?date=${date}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load daily report:", err));
  }, [date]);

  return (
    <div className="p-6 space-y-4 text-">
      <h1 className="text-2xl font-bold">Daily Report</h1>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2" />

      {data && (
        <>
          <ReportCard title="งานใหม่วันนี้" value={data.new_tasks} />
          <ReportCard title="งานครบกำหนดวันนี้" value={data.due_today} />
          <ReportCard title="จำนวนงานในวันนั้น" value={data.total_tasks_today} />

          <div>
            <h2 className="font-semibold mt-4 mb-2">รายการงานวันนี้</h2>
            <ul className="space-y-2">
              {data.tasks_today.map((task) => (
                <li key={task.id} className="border p-2 rounded">
                  {task.name} ({task.status}) - {task.type_name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
