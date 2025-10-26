import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import "./index.css"
import Body from "./components/Body"
import Login from "./components/Login"

function App() {

  return (
    <>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Body />} > 
      <Route path="/login" element={<Login />} />

      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
