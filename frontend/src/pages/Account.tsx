import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import toast from "react-hot-toast";
import { MdOutlineReceiptLong, MdLogout } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

const Account = () => {
  const navigate = useNavigate();

  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setIsAuth = useAppStore((state) => state.setIsAuth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    navigate("/login", { replace: true });
    toast.success("logout Success");
  };

  return (
    <div className="min-h-screen bg-white px-4">
      <div className="mx-auto w-full max-w-sm space-y-6 pt-10">
        <h1 className="text-center text-2xl font-bold">Account</h1>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.image || "https://placehold.co/96x96"}
              alt={user?.name || "User"}
              className="h-16 w-16 rounded-full border object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-gray-900">
                {user?.name || "Unknown"}
              </p>
              <p className="truncate text-sm text-gray-500">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-600">Role</span>
              <span className="text-sm font-medium capitalize text-gray-900">
                {user?.role || "not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <MdOutlineReceiptLong className="h-6 w-6 text-[#E23744]" />
            <span>Your Orders</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/address")}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <HiOutlineLocationMarker className="h-6 w-6 text-[#E23744]" />
            <span>Address</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#E23744] bg-white px-3 py-4 text-sm font-semibold text-[#E23744] transition hover:bg-red-50"
          >
            <MdLogout className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
