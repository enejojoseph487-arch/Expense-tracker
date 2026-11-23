// options can be plain strings or { value, label } objects
export default function Select({
  label,
  options = [],
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        {...props}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((o) => {
          const value = typeof o === "string" ? o : o.value;
          const text = typeof o === "string" ? o : o.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
}
