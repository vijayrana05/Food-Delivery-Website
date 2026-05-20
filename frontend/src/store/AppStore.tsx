import { create } from "zustand";
import { authService } from "../main";
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

export const useAppStore = create<AppStateType>((set) => ({
  user: null,
  isAuth: false,
  loading: true,
  location: null,
  loadingLocation: false,
  city: null,

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
      // user denied location / timeout / request failed
      console.log(error);
      set({ city: null, location: null });
    } finally {
      set({ loadingLocation: false });
    }
  },
}));