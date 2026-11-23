export default function Alert({ message, type = "error" }) {
  if (!message) return null;
  const styles =
    type === "error"
      ? "bg-red-50 text-red-600 border-red-200"
      : "bg-green-50 text-green-700 border-green-200";
  return <div className={`rounded-lg border px-3 py-2 text-sm ${styles}`}>{message}</div>;
}
