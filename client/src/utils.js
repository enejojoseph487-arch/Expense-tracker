export const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

// Change the currency here (e.g. "USD", "GBP", "NGN")
const CURRENCY = "NGN";

export const formatMoney = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: CURRENCY }).format(
    n || 0
  );

export const formatDate = (d) => new Date(d).toLocaleDateString();

// Where each role lands after login
export const homePath = (user) => (user?.role === "admin" ? "/admin" : "/dashboard");

// Pull the server's error message out of an axios error
export const getError = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";
