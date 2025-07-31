import { useEffect, useState } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard";

export default function MonthlyReportPage() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/reports/monthly?month=${month}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load monthly report:", err));
  }, [month]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Monthly Report</h1>
      <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2" />

      {data && (
        <>
          <ReportCard title="จำนวนงานทั้งหมด" value={data.total_tasks} />
          <ReportCard title="สถานะ: เสร็จแล้ว" value={data.status_summary.done} />
          <ReportCard title="สถานะ: กำลังทำ" value={data.status_summary.in_progress} />
          <ReportCard title="สถานะ: ยกเลิก" value={data.status_summary.cancel} />
        </>
      )}
    </div>
  );
}
