import { useEffect, useMemo, useState } from 'react'
import type { IRestaurant } from '../types/restaurantTypes'
import axios from 'axios';
import { restaurantService } from '../main';
import AddRestaurant from '../components/AddRestaurant';
import RestaurantProfile from '../components/RestaurantProfile';

type TabKey = "menu" | "add" | "sales";

export const Restaurant = () => {
    const[restaurant, setRestaurant] =  useState<IRestaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>("menu");

    const fetchMyRestaurant = async () => {
        try {
            const {data} = await axios.get(`${restaurantService}/api/restaurants/my`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setRestaurant(data.restaurant || null);

            if(data.token) {
                localStorage.setItem("token", data.token);
            }
        } catch (error: any) {
            // If no restaurant yet, show add form (don't treat as fatal)
            if (error?.response?.status === 404) {
                setRestaurant(null);
                return;
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRestaurant();
    }, []);

    const tabButton = useMemo(() => {
        const base = "flex-1 px-4 py-3 text-sm font-semibold transition";
        const active = "border-b-2 border-[#E23744] text-[#E23744]";
        const inactive = "text-gray-500 hover:text-gray-700";
        return { base, active, inactive };
    }, []);

    if(loading) {
        return <div className='flex min-h-screen items-center justify-center'>
           <p className='animate-pulse'>Loading...</p>
        </div>
    }

    if(!restaurant) {
        return <AddRestaurant onCreated={fetchMyRestaurant} />
    }

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="mx-auto w-full max-w-2xl">
            <RestaurantProfile
              restaurant={restaurant}
              isSeller
              onEdit={() => {
                // TODO: open edit modal
                console.log("edit restaurant");
              }}
              onToggleOpen={() => {
                // TODO: wire API later
                console.log("toggle open/close");
              }}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b">
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`${tabButton.base} ${activeTab === "menu" ? tabButton.active : tabButton.inactive}`}
              >
                Menu Items
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className={`${tabButton.base} ${activeTab === "add" ? tabButton.active : tabButton.inactive}`}
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sales")}
                className={`${tabButton.base} ${activeTab === "sales" ? tabButton.active : tabButton.inactive}`}
              >
                Sales
              </button>
            </div>

            <div className="p-5">
              {activeTab === "menu" && (
                <div className="text-sm text-gray-600">Menu Page</div>
              )}
              {activeTab === "add" && (
                <div className="text-sm text-gray-600">Add Item Page</div>
              )}
              {activeTab === "sales" && (
                <div className="text-sm text-gray-600">Sales Page</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

