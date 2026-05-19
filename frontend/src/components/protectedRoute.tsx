import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

const ProtectedRoute = () => {

    const isAuth = useAppStore((state) => state.isAuth);
    const loading = useAppStore((state) => state.loading);
    const user = useAppStore((state) => state.user);

    const location = useLocation();
    if (loading) return null;

    

    if(!isAuth) {
        return <Navigate to={"/login"} replace />
    }

    if(user?.role === null && location.pathname!== "/select-role") {
        return <Navigate to={"/select-role"} replace />
    }

    if(user?.role != null && location.pathname === "/select-role") {
        return <Navigate to={"/"} replace />
    }

    return <Outlet />;
};

export default ProtectedRoute;
