import { useEffect, useState } from "react";
import { FiCreditCard, FiList, FiCalendar } from "react-icons/fi";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Alert from "../components/Alert";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import { formatMoney, getError } from "../utils";

export default function UserDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setExpenses((await api.get("/expenses")).data);
    } catch (err) {
      setError(getError(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data) => {
    setError("");
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/expenses/${editing._id}`, data);
        setEditing(null);
      } else {
        await api.post("/expenses", data);
      }
      await load();
      return true;
    } catch (err) {
      setError(getError(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete "${expense.title}"?`)) return;
    try {
      await api.delete(`/expenses/${expense._id}`);
      await load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const now = new Date();
  const thisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-6 p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={FiCreditCard} label="Total spent" value={formatMoney(total)} />
          <StatCard icon={FiCalendar} label="This month" value={formatMoney(thisMonth)} />
          <StatCard icon={FiList} label="Expenses" value={expenses.length} />
        </div>

        <Alert message={error} />

        <Card title={editing ? "Edit expense" : "Add expense"}>
          <ExpenseForm
            expense={editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            loading={saving}
          />
        </Card>

        <Card title="My expenses">
          <ExpenseTable expenses={expenses} onEdit={setEditing} onDelete={handleDelete} />
        </Card>
      </main>
    </>
  );
}
