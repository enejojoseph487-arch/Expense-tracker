import { useEffect, useState } from "react";
import { FiCreditCard, FiList, FiTrash2, FiUsers } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Alert from "../components/Alert";
import Button from "../components/Button";
import ExpenseTable from "../components/ExpenseTable";
import { formatDate, formatMoney, getError } from "../utils";

export default function AdminDashboard() {
  const { user: me } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s, u, e] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/expenses"),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setExpenses(e.data);
    } catch (err) {
      setError(getError(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (url, label) => {
    if (!window.confirm(`Delete ${label}?`)) return;
    try {
      await api.delete(url);
      await load();
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-6 p-4">
        <Alert message={error} />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={FiUsers} label="Users" value={stats?.totalUsers ?? "-"} />
          <StatCard icon={FiList} label="Expenses" value={stats?.totalExpenses ?? "-"} />
          <StatCard
            icon={FiCreditCard}
            label="Total spent"
            value={stats ? formatMoney(stats.totalAmount) : "-"}
          />
        </div>

        {stats?.byCategory.length > 0 && (
          <Card title="Spending by category">
            <ul className="space-y-2 text-sm">
              {stats.byCategory.map((c) => (
                <li key={c.category} className="flex justify-between">
                  <span>{c.category}</span>
                  <span className="font-medium">{formatMoney(c.total)}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Users">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Joined</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4 capitalize">{u.role}</td>
                    <td className="py-2 pr-4">{formatDate(u.createdAt)}</td>
                    <td className="flex justify-end py-2">
                      {u._id !== me.id && (
                        <Button
                          variant="danger"
                          icon={FiTrash2}
                          aria-label="Delete user"
                          onClick={() => remove(`/admin/users/${u._id}`, `user "${u.name}" and all their expenses`)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="All expenses">
          <ExpenseTable
            expenses={expenses}
            showUser
            onDelete={(e) => remove(`/admin/expenses/${e._id}`, `"${e.title}"`)}
          />
        </Card>
      </main>
    </>
  );
}
