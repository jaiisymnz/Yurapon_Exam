export default function ReportCard({ title, value }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
