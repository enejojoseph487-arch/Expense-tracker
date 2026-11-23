export default function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
