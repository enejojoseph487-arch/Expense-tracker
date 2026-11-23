export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        {...props}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
