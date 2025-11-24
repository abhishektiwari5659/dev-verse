import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider, useDispatch } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Signup from "./components/Signup";
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "./utils/constant";
import { addUser } from "./utils/userSlice";

// -------------------------------------------------------
//   AUTH WRAPPER — RESTORES USER FROM COOKIE ON REFRESH
// -------------------------------------------------------
const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [authLoaded, setAuthLoaded] = React.useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view");
        dispatch(addUser(res.data));
      } catch {
        dispatch(addUser(null)); // 🔥 ensure no old user remains
      } finally {
        setAuthLoaded(true); // 🔥 allow UI to render
      }
    };

    fetchUser();
  }, []);

  // 🔥 Prevent UI from rendering until auth check completes
  if (!authLoaded) {
    return (
      <div className="text-center text-gray-300 py-10">
        Checking session...
      </div>
    );
  }

  return children;
};


// -------------------------------------------------------

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        {/* Restore user on refresh */}
        <AuthLoader>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/request" element={<Requests />} />
            </Route>
          </Routes>
        </AuthLoader>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
