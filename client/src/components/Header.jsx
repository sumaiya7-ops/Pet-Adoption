import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { Menu, X, LogOut, LogIn, UserPlus } from "lucide-react";
import logo from "../assets/logo.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Logout successful! 🐾");
        setMenuOpen(false);
      })
      .catch(() => {
        toast.error("Logout failed ❌");
      });
  };  
  const navLinkClass = ({ isActive }) =>
    `text-sm font-black tracking-wide transition-all duration-300 py-2.5 px-4 rounded-xl flex items-center gap-2 ${
      isActive
        ? "bg-purple-900 text-white shadow-md shadow-purple-950/10"
        : "text-blue-900 hover:bg-indigo-50 hover:text-purple-950"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-indigo-50 w-full transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">

          {/*  Logo Section */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={logo}
              alt="PetAdopt Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full shadow-md group-hover:scale-105 transition duration-300 border border-indigo-50"
            />
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight leading-none group-hover:text-purple-950">
                PetAdopt
              </h2>
              <p className="text-[9px] md:text-[10px] text-purple-900/50 font-black uppercase tracking-widest mt-1">
                Find Your Best Friend
              </p>
            </div>
          </Link>

          {/*  Navigation Menu  */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/all-pets" className={navLinkClass}>All Pets</NavLink>

            {user && (
              <>
                <NavLink to="/dashboard/my-requests" className={navLinkClass}>My Requests</NavLink>
                <NavLink to="/dashboard/add-pet" className={navLinkClass}>Add Pet</NavLink>
                <NavLink to="/dashboard/my-listings" className={navLinkClass}>My Listings</NavLink>
              </>
            )}
           </nav>
       
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {user ? (
              <>
                <img
                  src={user?.photoURL || "https://ibb.co"}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border-2 border-purple-800/20 object-cover shadow-sm hover:border-purple-800 transition"
                  title={user?.displayName || "User"}
                />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-black text-xs py-2.5 px-4 rounded-xl border border-red-100 hover:border-red-500 shadow-sm transition active:scale-95"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-indigo-50 hover:bg-indigo-100 text-purple-900 font-black text-xs py-2.5 px-4 rounded-xl border border-indigo-100 transition active:scale-95"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-purple-900 text-white font-black text-xs py-2.5 px-4.5 rounded-xl transition duration-300 shadow-md active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>      
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl bg-indigo-50 text-purple-900 hover:bg-indigo-100 transition shadow-sm active:scale-95"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>    
      {menuOpen && (
        <div className="md:hidden border-t border-indigo-50 bg-white/95 backdrop-blur-md absolute left-0 w-full shadow-2xl animate-fade-in z-50">
          <div className="px-5 py-6 flex flex-col gap-3">
            
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={navLinkClass}>Home</NavLink>
            <NavLink to="/all-pets" onClick={() => setMenuOpen(false)} className={navLinkClass}>All Pets</NavLink>

            {user && (
              <>
                <NavLink to="/dashboard/my-requests" onClick={() => setMenuOpen(false)} className={navLinkClass}>My Requests</NavLink>
                <NavLink to="/dashboard/add-pet" onClick={() => setMenuOpen(false)} className={navLinkClass}>Add Pet</NavLink>
                <NavLink to="/dashboard/my-listings" onClick={() => setMenuOpen(false)} className={navLinkClass}>My Listings</NavLink>
              </>
            )}        
            <div className="pt-4 mt-2 border-t border-indigo-50 flex flex-col gap-3">
              {user ? (
                <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-2xl border border-indigo-50/40">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user?.photoURL || "https://ibb.co"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-purple-800/10"
                    />
                    <span className="text-sm font-black text-blue-900 truncate max-w-[140px]">{user?.displayName || "User"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-black text-xs py-2 px-3 rounded-xl border border-red-100 transition"
                  >
                    <LogOut size={13} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1 bg-indigo-50 text-purple-900 text-center py-3 rounded-xl font-black text-xs border border-indigo-100"
                  >
                    <LogIn size={14} /> Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1 bg-emerald-600 text-white text-center py-3 rounded-xl font-black text-xs shadow"
                  >
                    <UserPlus size={14} /> Register
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
