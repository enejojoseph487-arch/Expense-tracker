import { FiLogOut, FiPieChart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
      
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-bold text-indigo-600">
          <FiPieChart /> Expense Manager
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 sm:block">
              {user.name}{" "}
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs capitalize text-indigo-700">
                {user.role}
              </span>
            </span>
            <Button variant="secondary" icon={FiLogOut} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
