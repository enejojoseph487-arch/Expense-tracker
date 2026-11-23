export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
      <div className="rounded-full bg-indigo-100 p-3 text-xl text-indigo-600">
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
