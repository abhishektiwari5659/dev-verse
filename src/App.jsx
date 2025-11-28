import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
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
import LandingPage from "./components/LandingPage";
import { useDispatch } from "react-redux";
import Premium from "./components/Premium";
import Chat from "./components/Chat";

// -------------------------------------------------------
//   AUTH WRAPPER — RESTORES USER FROM COOKIE ON REFRESH
//   (used only for app routes so landing page loads instantly)
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
        dispatch(addUser(null)); // ensure no old user remains
      } finally {
        setAuthLoaded(true); // allow UI to render
      }
    };

    fetchUser();
  }, [dispatch]);

  // Prevent UI from rendering until auth check completes
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
        <Routes>
          {/* Landing page as the root */}
          <Route path="/" element={<LandingPage />} />

          {/* Keep top-level login/signup for backward compatibility */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App (protected) - moved under /app */}
          <Route
            path="/app/*"
            element={
              <AuthLoader>
                <Body />
              </AuthLoader>
            }
          >
            {/* nested routes inside Body (adjusted paths become /app, /app/profile, etc.) */}
            <Route index element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="request" element={<Requests />} />
            <Route path="premium" element={<Premium />} />
            <Route path="chat/:target" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
