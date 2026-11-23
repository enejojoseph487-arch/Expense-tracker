import { useEffect, useState } from "react";
import { FiPlus, FiSave } from "react-icons/fi";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { CATEGORIES } from "../utils";

const today = () => new Date().toISOString().slice(0, 10);
const empty = { title: "", amount: "", category: "Food", date: today(), note: "" };

// Used for both adding and editing: pass `expense` to edit
export default function ExpenseForm({ expense, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(expense ? { ...expense, date: expense.date.slice(0, 10) } : empty);
  }, [expense]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({ ...form, amount: Number(form.amount) });
    if (ok && !expense) setForm({ ...empty, date: today() });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
      <Input
        label="Amount"
        name="amount"
        type="number"
        min="0"
        step="0.01"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <Select
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
        options={CATEGORIES}
      />
      <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
      <Input
        label="Note (optional)"
        name="note"
        value={form.note}
        onChange={handleChange}
        className="sm:col-span-2"
      />
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" icon={expense ? FiSave : FiPlus} loading={loading}>
          {expense ? "Save changes" : "Add expense"}
        </Button>
        {expense && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
