import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import { Toaster } from "react-hot-toast"
import { useAppStore } from "./store/AppStore"
import { useEffect, useMemo } from "react"
import PublicRoute from "./components/publicRoute"
import ProtectedRoute from "./components/protectedRoute"
import SelectRole from "./pages/SelectRole"
import Account from "./pages/Account"
import Navbar from "./components/navbar"
import { Restaurant } from "./pages/Restaurant"
import RestaurantDetails from "./pages/RestaurantDetails"


const App = () => {
  const fetchUser = useAppStore((state) => state.fetchUser)
  const fetchLocation = useAppStore((state) => state.fetchLocation)
  const user = useAppStore((state) => state.user)
  const loading = useAppStore((state) => state.loading)

  useEffect(() => {
    fetchUser()
    fetchLocation()
  }, [fetchUser, fetchLocation])

  const shouldShowRestaurant = useMemo(() => {
    return !loading && user?.role === "seller"
  }, [loading, user?.role])

  return (
    <>
      <Toaster position="top-center" />

      {shouldShowRestaurant ? (
        <Restaurant />
      ) : (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/account" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App
