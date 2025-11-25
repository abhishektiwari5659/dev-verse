import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constant'
import { removeUser } from '../utils/userSlice'

const Navbar = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.delete(BASE_URL + "/logout", { withCredentials: true })
      dispatch(removeUser())
      return navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  // --- Icon Placeholders (Only keeping required icons) ---
  const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 11.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM8.25 6.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 4.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM12 14.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" /></svg>;
  const IconConnect = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6 4.5-4.5M18 8.25V5.25c0-1.24-.96-2.25-2.25-2.25h-5.25" /></svg>;
  const IconRequest = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.86-1.572-.86-3.413 0-4.985 1.571-2.887 4.793-4.5 8.125-4.5s6.554 1.613 8.125 4.5c.86 1.572.86 3.413 0 4.985-1.571 2.887-4.793 4.5-8.125 4.5s-6.554-1.613-8.125-4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
  const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3.75 3.75M12 9V15" /></svg>;
  // ---

  return (
    <div className="relative z-50">
      
      {/* Navbar Container: Glass/Holographic Background and Neon Border */}
      <div className="navbar bg-black/50 backdrop-blur-md border-b border-green-400/30 shadow-[0_4px_25px_#00ff8f20] transition-all">
        
        {/* Left Section: Logo only (Minimalist) */}
        <div className="flex-1">
          <Link 
            to="/app" 
            className="btn btn-ghost text-3xl tracking-wider font-mono text-green-400 
                       drop-shadow-[0_0_8px_#00ff8f] transition-all hover:text-green-300"
          >
            Dev-Verse
          </Link>
          
          {/* Removed: Main Navigation Links */}
        </div>

        {/* Right Section: User Dropdown (Conditional) */}
        {user ? (
          <div className="flex gap-2">
            
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle avatar border-2 border-green-400 p-0.5 shadow-[0_0_8px_#00ff8f60]"
              >
                <div className="w-10 rounded-full overflow-hidden">
                  <img
                    alt={user.firstName || "Profile Avatar"}
                    src={user.photoUrl || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                  />
                </div>
              </div>
              
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gray-900 border border-green-400/50 rounded-lg z-[99] mt-3 w-56 p-3 shadow-[0_0_20px_#00ff8f40] space-y-1 font-mono" 
              >
                <li className="menu-title text-green-400 text-xs uppercase tracking-wider border-b border-gray-700 pb-2 mb-2">
                  ACCESS: {(user?.firstName?.trim()?.toUpperCase()) || "USER"}
                </li>
                
                {/* Removed: /HOME Directory and Find MATCHES */}
                
                {/* Remaining Navigation Links */}
                <li>
                  <Link to="/app/profile" className="justify-between text-gray-300 hover:bg-green-400/20 active:bg-green-400/30 rounded-md py-2 px-3">
                    <span className='flex items-center gap-2'><IconUser /> Profile HUD</span>
                    <span className="badge badge-sm bg-green-500/80 text-black border-none">EDIT</span>
                  </Link>
                </li>
                <li>
                  <Link to="/app/connections" className='text-gray-300 hover:bg-green-400/20 active:bg-green-400/30 rounded-md py-2 px-3'>
                    <span className='flex items-center gap-2'><IconConnect /> Connections Log</span>
                  </Link>
                </li>
                <li>
                  <Link to="/app/request" className='text-gray-300 hover:bg-green-400/20 active:bg-green-400/30 rounded-md py-2 px-3'>
                    <span className='flex items-center gap-2'><IconRequest /> Pending Requests</span>
                  </Link>
                </li>
                
                <div className="h-px bg-gray-700/50 mt-2 mb-2"></div>

                <li>
                  <a onClick={handleLogout} className='text-red-400 hover:bg-red-400/20 active:bg-red-400/30 rounded-md py-2 px-3'>
                    <span className='flex items-center gap-2'><IconLogout /> Logout Session</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Authentication Buttons (if user is not logged in) */
          <div className="flex gap-3">
            <Link 
              to="/login" 
              className="btn btn-ghost text-green-400 hover:text-green-300 font-mono"
            >
              /AUTH: LOGIN
            </Link>
            <Link 
              to="/signup" 
              className="btn bg-green-400 hover:bg-green-300 text-black font-semibold border-none shadow-[0_0_10px_#00ff8f80] font-mono"
            >
              /AUTH: REGISTER
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar