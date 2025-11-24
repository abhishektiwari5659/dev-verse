import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login + signup pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  const userData = useSelector((store) => store.user);

  const fetchData = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error);

      // If not logged in → redirect to login
      if (error?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchData(); // YOU FORGOT TO CALL THIS
  }, []);

  return (
    <div>
      {/* Hide navbar on signup/login */}
      {!hideNavbar && <Navbar />}

      <Outlet />
    </div>
  );
};

export default Body;
