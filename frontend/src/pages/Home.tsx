import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { restaurantService } from "../main";
import { useAppStore } from "../store/AppStore";
import type { IRestaurant } from "../types/restaurantTypes";
import { haversineKm } from "../utils/geo";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantGridSkeleton from "../components/RestaurantGridSkeleton";

type NearbyRestaurantResponse = {
  restaurants: IRestaurant[];
  count?: number;
};

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const location = useAppStore((s) => s.location);
  const loadingLocation = useAppStore((s) => s.loadingLocation);

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!location?.latitude || !location?.longitude) {
        setRestaurants([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get<NearbyRestaurantResponse>(
          `${restaurantService}/api/restaurants/all`,
          {
            params: {
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 5000,
              search,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRestaurants(data?.restaurants ?? []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [location?.latitude, location?.longitude, search, token]);

  const restaurantsWithDistance = useMemo(() => {
    if (!location?.latitude || !location?.longitude) return [];
    return restaurants
      .map((r) => {
        const [lng, lat] = r.autolocation?.coordinates ?? [0, 0];
        const distanceKm = haversineKm(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: lat, longitude: lng }
        );
        return { restaurant: r, distanceKm };
      })
      .sort((a, b) => {
        // Prefer open restaurants, then closer distance
        if (a.restaurant.isOpen !== b.restaurant.isOpen) {
          return a.restaurant.isOpen ? -1 : 1;
        }
        return a.distanceKm - b.distanceKm;
      });
  }, [location?.latitude, location?.longitude, restaurants]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Restaurants near you</h1>
            <p className="mt-1 text-sm text-gray-600">
              {loadingLocation
                ? "Detecting your location..."
                : location
                  ? "Based on your current location"
                  : "Location not available"}
            </p>
          </div>
        </div>

        {loading ? (
          <RestaurantGridSkeleton />
        ) : !location ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
            Please allow location access to see nearby restaurants.
          </div>
        ) : !restaurantsWithDistance.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
            No restaurants found nearby.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantsWithDistance.map(({ restaurant, distanceKm }) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                distanceKm={distanceKm}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
