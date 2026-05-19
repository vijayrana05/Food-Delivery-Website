import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import {Toaster} from "react-hot-toast"
import { useAppStore } from "./store/AppStore"
import { useEffect } from "react"
import PublicRoute from "./components/publicRoute"
import ProtectedRoute from "./components/protectedRoute"
import SelectRole from "./pages/SelectRole"
const App = () => {
  const fetchUser = useAppStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  
  return <>
  <BrowserRouter>
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/select-role" element={<SelectRole />} />
    </Route>
    
    
  </Routes>
  <Toaster />
  </BrowserRouter>
  </>
    
  
}

export default App
