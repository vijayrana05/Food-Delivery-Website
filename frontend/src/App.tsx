import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import {Toaster} from "react-hot-toast"
import { useAppStore } from "./store/AppStore"
import { useEffect } from "react"
const App = () => {
  const fetchUser = useAppStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  
  return <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
  </Routes>
  <Toaster />
  </BrowserRouter>
  </>
    
  
}

export default App
