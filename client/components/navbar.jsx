import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { PawPrint, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const activeStyle = ({ isActive }) => 
        `text-sm font-bold tracking-wide transition-colors ${isActive ? "text-emerald-400" : "text-slate-400 hover:text-white"}`;

    return (
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo + Website Name */}
                <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-wider text-white">
                    <PawPrint className="text-emerald-500 w-6 h-6" />
                    <span>PET<span className="text-emerald-500">ADOPT</span></span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={activeStyle}>Home</NavLink>
                    <NavLink to="/all-pets" className={activeStyle}>All Pets</NavLink>
                    {user && (
                        <>
                            <NavLink to="/dashboard/my-requests" className={activeStyle}>My Requests</NavLink>
                            <NavLink to="/dashboard/add-pet" className={activeStyle}>Add Pet</NavLink>
                        </>
                    )}
                </nav>

                {/* Profile Dropdown / Login Button */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative group">
                            <img 
                                src={user.photoURL || "https://placehold.co"} 
                                alt="profile" 
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-emerald-500 shadow-md object-cover"
                            />
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 hidden group-hover:block transition-all text-xs text-slate-300">
                                <div className="px-4 py-2 border-b border-slate-700 font-bold text-white max-w-[180px] truncate">
                                    {user.displayName}
                                </div>
                                <Link to="/dashboard/my-requests" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700 hover:text-white transition">
                                    <LayoutDashboard size={14} /> Dashboard
                                </Link>
                                <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-slate-700 transition">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
