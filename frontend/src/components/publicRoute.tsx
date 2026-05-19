import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
const PublicRoute = () => {
  // 1. Grab auth states directly from Zustand
  const isAuth = useAppStore((state) => state.isAuth);
  const loading = useAppStore((state) => state.loading);

  // 2. If the app is still fetching the user token, show a blank space or spinner
  if (loading) return null;

  // 3. If authenticated, redirect to home page. Otherwise, show the sub-route (Login page)
  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;