import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { getError, homePath } from "../utils";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homePath(user)} replace />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const created = await register(form.name, form.email, form.password);
      navigate(homePath(created));
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card title="Create account" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} />
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Register
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
