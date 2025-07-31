import DailyReport from "../components/DailyReport";
import MonthlyReport from "../components/MonthlyReport";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Report Page</h1>
      <DailyReport />
      <MonthlyReport />
    </div>
  );
}
