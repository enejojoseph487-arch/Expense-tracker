import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { getError, homePath } from "../utils";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homePath(user)} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedIn = await login(form.email, form.password);
      navigate(homePath(loggedIn));
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card title="Login" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <Button type="submit" loading={loading} className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          No account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
