import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "./Button";
import { formatDate, formatMoney } from "../utils";

// Shared by both dashboards.
// showUser: show who owns each expense (admin)  |  onEdit: optional (user only)
export default function ExpenseTable({ expenses, onEdit, onDelete, showUser = false }) {
  if (!expenses.length) {
    return <p className="py-6 text-center text-sm text-gray-500">No expenses yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 pr-4">Date</th>
            {showUser && <th className="py-2 pr-4">User</th>}
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Category</th>
            <th className="py-2 pr-4">Amount</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id} className="border-b last:border-0">
              <td className="py-2 pr-4">{formatDate(e.date)}</td>
              {showUser && <td className="py-2 pr-4">{e.user?.name || "Deleted user"}</td>}
              <td className="py-2 pr-4">{e.title}</td>
              <td className="py-2 pr-4">{e.category}</td>
              <td className="py-2 pr-4 font-medium">{formatMoney(e.amount)}</td>
              <td className="flex justify-end gap-2 py-2">
                {onEdit && (
                  <Button variant="secondary" icon={FiEdit2} onClick={() => onEdit(e)} aria-label="Edit" />
                )}
                <Button variant="danger" icon={FiTrash2} onClick={() => onDelete(e)} aria-label="Delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
