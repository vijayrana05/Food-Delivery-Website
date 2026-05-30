import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BiMapPin } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { restaurantService } from "../main";
import { useAppStore } from "../store/AppStore";
import type { IRestaurant, IMenuItems } from "../types/restaurantTypes";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [items, setItems] = useState<IMenuItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  const fetchCart = useAppStore((s) => s.fetchCart);

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        setLoading(true);

        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`${restaurantService}/api/restaurants/id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${restaurantService}/api/items/all/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRestaurant(restaurantRes.data ?? null);
        setItems(menuRes.data?.items ?? []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, token]);

  const addToCart = async (itemId: string) => {
    if (!id) return;

    if (!token) {
      toast.error("Please login");
      return;
    }

    try {
      setAddingItemId(itemId);
      const { data } = await axios.post(
        `${restaurantService}/api/cart/add`,
        { restaurantId: id, itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data?.message || "Added to cart");
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-gray-600">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <img src={restaurant.image} alt={restaurant.name} className="h-56 w-full object-cover" />
          <div className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
              <span
                className={
                  "rounded-full px-3 py-1 text-xs font-semibold " +
                  (restaurant.isOpen ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700")
                }
              >
                {restaurant.isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <BiMapPin className="mt-0.5 h-4 w-4 text-[#E23744]" />
              <p className="line-clamp-2">{restaurant.autolocation?.formattedAddress}</p>
            </div>

            <p className="text-sm text-gray-700">{restaurant.description}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">Menu</h2>

          {!items.length ? (
            <p className="mt-3 text-sm text-gray-600">No items yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const unavailable = !item.isAvailable;
                const isAdding = addingItemId === item._id;

                return (
                  <div
                    key={item._id}
                    className={
                      "flex gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 " +
                      (unavailable ? "opacity-70" : "")
                    }
                  >
                    <div className="relative h-16 w-20 overflow-hidden rounded-lg bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={"h-full w-full object-cover " + (unavailable ? "grayscale" : "")}
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

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="shrink-0 text-sm font-semibold text-gray-800">₹{item.price}</p>
                      </div>
                      {item.description && (
                        <p className="line-clamp-2 text-xs text-gray-600">{item.description}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {unavailable ? "Unavailable" : "Available"}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(item._id)}
                          disabled={unavailable || isAdding}
                          className={
                            "inline-flex items-center gap-2 rounded-lg bg-[#E23744] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d32f3a]" +
                            (unavailable || isAdding ? " cursor-not-allowed opacity-60" : "")
                          }
                          aria-label="Add to cart"
                          title="Add to cart"
                        >
                          <FiPlusCircle className="h-4 w-4" />
                          {isAdding ? "Adding" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
