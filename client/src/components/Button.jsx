const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export default function Button({
  children,
  icon: Icon,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || props.disabled}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon />}
      {loading ? "Please wait..." : children}
    </button>
  );
}
