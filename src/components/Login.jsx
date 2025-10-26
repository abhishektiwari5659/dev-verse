import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password }); 
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
              value={email}
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
