import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Login = () => {
  const [emailId, setEmail] = useState("abhi@dev.com");
  const [password, setPassword] = useState("Abhi@123");
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh

    try {
      const res = await axios.post( BASE_URL + "/login", {
        emailId,
        password,
      }, {withCredentials: true});

      dispatch(addUser(res.data))
      return navigate("/")
    } catch (error) {
      setError(error?.response?.data)
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-red-700">{error}</p>
          <button
            type="submit"
            className="btn btn-primary w-full text-white font-medium tracking-wide hover:scale-[1.02] transition-transform duration-200"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-400 font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
