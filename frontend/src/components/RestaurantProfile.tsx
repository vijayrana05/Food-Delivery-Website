import { useMemo } from "react";
import type { IRestaurant } from "../types/restaurantTypes";
import { BiMapPin } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";

type RestaurantProfileProps = {
  restaurant: IRestaurant;
  isSeller?: boolean;
  onEdit?: () => void;
  onToggleOpen?: () => void;
  togglingOpen?: boolean;
};

const formatDate = (value: IRestaurant["createdAt"]) => {
  try {
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString();
  } catch {
    return "";
  }
};

const RestaurantProfile = ({
  restaurant,
  isSeller = false,
  onEdit,
  onToggleOpen,
  togglingOpen = false,
}: RestaurantProfileProps) => {
  const statusLabel = useMemo(() => (restaurant.isOpen ? "OPEN" : "CLOSED"), [restaurant.isOpen]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-48 w-full object-cover"
        />

        {isSeller && (
          <button
            type="button"
            onClick={onEdit}
            className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
            aria-label="Edit restaurant"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-900">{restaurant.name}</h2>

            <div className="mt-1 flex items-start gap-2 text-sm text-gray-600">
              <BiMapPin className="mt-0.5 h-4 w-4 text-[#E23744]" />
              <p className="line-clamp-2">
                {restaurant.autolocation?.formattedAddress || "Address not available"}
              </p>
            </div>
          </div>
        </div>

        {restaurant.description && (
          <p className="text-sm text-gray-700">{restaurant.description}</p>
        )}

        <div className="flex items-center justify-between border-t pt-3">
          <div className="text-sm font-semibold">
            <span className={restaurant.isOpen ? "text-green-600" : "text-red-500"}>
              {statusLabel}
            </span>
          </div>

          {isSeller && (
            <button
              type="button"
              onClick={onToggleOpen}
              disabled={togglingOpen || !onToggleOpen}
              className={
                "rounded-lg px-4 py-2 text-sm font-semibold text-white transition " +
                (restaurant.isOpen
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700") +
                (togglingOpen || !onToggleOpen ? " cursor-not-allowed opacity-60" : "")
              }
            >
              {restaurant.isOpen ? "Close Restaurant" : "Open Restaurant"}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">Created on {formatDate(restaurant.createdAt)}</p>
      </div>
    </div>
  );
};

export default RestaurantProfile;
