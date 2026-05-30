import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { restaurantService } from "../main";
import { useAppStore } from "../store/AppStore";
import type { ICart } from "../types/cartType";

const Cart = () => {
  const fetchCart = useAppStore((s) => s.fetchCart);
  const cart = useAppStore((s) => s.cart);
  const quantity = useAppStore((s) => s.quantity);
  const subTotal = useAppStore((s) => s.subTotal);

  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const inc = async (itemId: string) => {
    try {
      setBusyItemId(itemId);
      await axios.put(
        `${restaurantService}/api/cart/inc`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to increment");
    } finally {
      setBusyItemId(null);
    }
  };

  const dec = async (itemId: string) => {
    try {
      setBusyItemId(itemId);
      await axios.put(
        `${restaurantService}/api/cart/dec`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to decrement");
    } finally {
      setBusyItemId(null);
    }
  };

  const clear = async () => {
    try {
      setClearing(true);
      await axios.delete(`${restaurantService}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Cart cleared");
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to clear cart");
    } finally {
      setClearing(false);
    }
  };

  const cartRestaurantName = useMemo(() => {
    const first = cart?.[0] as ICart | undefined;
    const restaurant: any = first?.restaurantId;
    return restaurant?.name || null;
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
            {cartRestaurantName && (
              <p className="mt-1 text-sm text-gray-600">From {cartRestaurantName}</p>
            )}
          </div>

          {!!cart.length && (
            <button
              type="button"
              onClick={clear}
              disabled={clearing}
              className={
                "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" +
                (clearing ? " cursor-not-allowed opacity-60" : "")
              }
            >
              <FiTrash2 className="h-4 w-4" />
              {clearing ? "Clearing..." : "Clear"}
            </button>
          )}
        </div>

        {!cart.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-gray-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-gray-600">Add items from a restaurant menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {cart.map((c: any) => {
                const item: any = c.itemId;
                const itemId = item?._id || c.itemId;
                const isBusy = busyItemId === itemId;

                return (
                  <div
                    key={c._id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-16 w-20 overflow-hidden rounded-lg bg-gray-100">
                        {item?.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">{item?.name || "Item"}</p>
                        {item?.description && (
                          <p className="line-clamp-1 text-xs text-gray-600">{item.description}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-gray-800">₹{item?.price ?? 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() => dec(itemId)}
                          disabled={isBusy}
                          className={
                            "px-3 py-2 text-gray-700 hover:bg-gray-50" +
                            (isBusy ? " cursor-not-allowed opacity-60" : "")
                          }
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <div className="min-w-10 px-3 py-2 text-center text-sm font-semibold text-gray-900">
                          {c.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => inc(itemId)}
                          disabled={isBusy}
                          className={
                            "px-3 py-2 text-gray-700 hover:bg-gray-50" +
                            (isBusy ? " cursor-not-allowed opacity-60" : "")
                          }
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="w-24 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{((item?.price ?? 0) * c.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">Bill Details</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Items</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subTotal.toFixed(0)}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between text-gray-900">
                  <span className="font-bold">To Pay</span>
                  <span className="font-bold">₹{subTotal.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-xl bg-[#E23744] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d32f3a]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
