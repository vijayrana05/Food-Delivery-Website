import { create } from "zustand";
import { authService, restaurantService } from "../main";
import type { AppStateType } from "../types/appStore";
import axios from "axios";

type NominatimReverseResponse = {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

export const useAppStore = create<AppStateType>((set, get) => ({
  user: null,
  isAuth: false,
  loading: true,
  location: null,
  loadingLocation: false,
  city: null,

  cart: [],
  subTotal: 0,
  quantity: 0,

  setUser: (user) => set({ user }),
  setIsAuth: (isAuth) => set({ isAuth }),
  setLoading: (loading) => set({ loading }),
  setLocation: (location) => set({ location }),
  setLoadingLocation: (loadingLocation) => set({ loadingLocation }),
  setCity: (city) => set({ city }),

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      set({ loading: true });

      const { data } = await axios.get(`${authService}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        user: data,
        isAuth: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ cart: [], subTotal: 0, quantity: 0 });
        return;
      }

      const { data } = await axios.post(
        `${restaurantService}/api/cart/all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        cart: data?.cart ?? [],
        subTotal: data?.subtotal ?? 0,
        quantity: data?.cartLength ?? 0,
      });
    } catch (error) {
      console.log(error);
    }
  },

  addToCart: async (restaurantId: string, itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${restaurantService}/api/cart/add`,
        { restaurantId, itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await get().fetchCart();
    } catch (error) {
      console.log(error);
      await get().fetchCart();
    }
  },

  incCartItem: async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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

      await get().fetchCart();
    } catch (error) {
      console.log(error);
      await get().fetchCart();
    }
  },

  decCartItem: async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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

      await get().fetchCart();
    } catch (error) {
      console.log(error);
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ cart: [], subTotal: 0, quantity: 0 });
        return;
      }

      await axios.delete(`${restaurantService}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await get().fetchCart();
    } catch (error) {
      console.log(error);
      await get().fetchCart();
    }
  },

  fetchLocation: async () => {
    if (!navigator.geolocation) {
      set({ city: null, location: null });
      return;
    }

    set({ loadingLocation: true });

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      const { data } = await axios.get<NominatimReverseResponse>(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            format: "json",
            lat: latitude,
            lon: longitude,
            addressdetails: 1,
          },
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      const bestCity =
        data.address?.city || data.address?.town || data.address?.village || null;

      set({
        city: bestCity,
        location: {
          latitude,
          longitude,
          formattedAddress: data.display_name || "",
        },
      });
    } catch (error) {
      console.log(error);
      set({ city: null, location: null });
    } finally {
      set({ loadingLocation: false });
    }
  },
}));