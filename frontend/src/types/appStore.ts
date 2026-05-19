export interface User {
  _id: string;
  email: string;
  name: string;
  image: string;
  role: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

// Fixed the missing semicolon at the end of isAuth line
export interface AppStateType {
  user: User | null;
  location: LocationData | null;
  isAuth: boolean; 
  loading: boolean;
  loadingLocation: boolean;
  city: string;
  setUser: (user: User | null) => void;
  setIsAuth: (auth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLocation: (location: LocationData | null) => void;
  setLoadingLocation: (loadingLocation: boolean) => void;
  setCity: (city: string | null) => void;
  fetchUser: () => Promise<void>;
}