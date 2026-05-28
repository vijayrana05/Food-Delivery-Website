import type { IRestaurant } from "../types/restaurantTypes";
import { BiMapPin } from "react-icons/bi";

type RestaurantCardProps = {
  restaurant: IRestaurant;
  distanceKm?: number | null;
  onClick?: () => void;
};

const RestaurantCard = ({ restaurant, distanceKm, onClick }: RestaurantCardProps) => {
  const closed = !restaurant.isOpen;

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#E23744]/30 " +
        (closed ? "opacity-70" : "")
      }
    >
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={"h-40 w-full object-cover " + (closed ? "grayscale" : "")}
          loading="lazy"
        />

        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">CLOSED</span>
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-base font-bold text-gray-900">{restaurant.name}</h3>
          {typeof distanceKm === "number" && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
              {distanceKm.toFixed(1)} km
            </span>
          )}
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <BiMapPin className="mt-0.5 h-4 w-4 text-[#E23744]" />
          <p className="line-clamp-2">{restaurant.autolocation?.formattedAddress || "Address not available"}</p>
        </div>

        <p className="line-clamp-2 text-sm text-gray-700">{restaurant.description}</p>
      </div>
    </button>
  );
};

export default RestaurantCard;
