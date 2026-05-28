import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineToggleOff, MdOutlineToggleOn } from "react-icons/md";
import { restaurantService } from "../main";
import type { IMenuItem } from "../types/menuItemTypes";

type MenuitemsProps = {
  restaurantId: string;
  refreshKey?: number;
};

const Menuitems = ({ restaurantId, refreshKey }: MenuitemsProps) => {
  const [items, setItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${restaurantService}/api/items/all/${restaurantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(data?.items ?? []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurantId) return;
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, refreshKey]);

  const deleteItem = async (itemId: string) => {
    try {
      setBusyId(itemId);
      await axios.delete(`${restaurantService}/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i._id !== itemId));
      toast.success("Item deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete item");
    } finally {
      setBusyId(null);
    }
  };

  const toggleAvailability = async (itemId: string) => {
    try {
      setBusyId(itemId);
      const { data } = await axios.put(
        `${restaurantService}/api/items/status/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updated = data?.item;
      if (updated?._id) {
        setItems((prev) => prev.map((i) => (i._id === updated._id ? { ...i, ...updated } : i)));
      } else {
        setItems((prev) => prev.map((i) => (i._id === itemId ? { ...i, isAvailable: !i.isAvailable } : i)));
      }

      toast.success(data?.message || "Updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update availability");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Loading items...</div>;
  }

  if (!items.length) {
    return <div className="text-sm text-gray-600">No items yet.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isBusy = busyId === item._id;
        const unavailable = !item.isAvailable;

        return (
          <div
            key={item._id}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-16 w-20 overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={
                      "h-full w-full object-cover " + (unavailable ? "grayscale opacity-60" : "")
                    }
                  />
                ) : (
                  <div className="h-full w-full" />
                )}

                {unavailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">
                      Not Available
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                {item.description && (
                  <p className="line-clamp-1 text-xs text-gray-600">{item.description}</p>
                )}
                <p className="mt-1 text-sm font-semibold text-gray-800">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleAvailability(item._id)}
                disabled={isBusy}
                className={
                  "rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50" +
                  (isBusy ? " cursor-not-allowed opacity-60" : "")
                }
                aria-label={item.isAvailable ? "Mark unavailable" : "Mark available"}
                title={item.isAvailable ? "Mark unavailable" : "Mark available"}
              >
                {item.isAvailable ? (
                  <MdOutlineToggleOn className="h-5 w-5 text-green-600" />
                ) : (
                  <MdOutlineToggleOff className="h-5 w-5 text-gray-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => deleteItem(item._id)}
                disabled={isBusy}
                className={
                  "rounded-lg border border-gray-200 bg-white p-2 text-red-600 hover:bg-red-50" +
                  (isBusy ? " cursor-not-allowed opacity-60" : "")
                }
                aria-label="Delete item"
                title="Delete item"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menuitems;
