import { create } from "zustand";
import { authService } from "../main";
import type { AppStateType } from "../types/appStore";

import axios from "axios";


export const useAppStore = create<AppStateType >((set) => ({
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

            if(!token) return;

            set({loading : true})

            const {data} = await axios.get(`${authService}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({
                user: data.user,
                isAuth: true
            })
        } catch (error) {
            console.log(error)
        } finally {
            set({loading: false})
        }
    }

}));