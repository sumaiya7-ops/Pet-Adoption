import { useState, useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ClipboardList, FilePlus, LayoutGrid, Home, FolderHeart, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 p-3.5 rounded-xl font-bold transition-all duration-300 ${
            isActive
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 border-l-4 border-white transform lg:translate-x-1"
                : "text-purple-200/70 hover:bg-white/10 hover:text-white"
        }`;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-blue-50 text-slate-900 font-sans relative">

            {/* Mobile Top Navbar (শুধুমাত্র ছোট স্ক্রিনে দেখাবে) */}
            <div className="lg:hidden flex items-center justify-between bg-purple-950 text-white p-4 sticky top-0 z-40 shadow-md">
                <div className="flex items-center gap-2">
                    <FolderHeart className="text-emerald-400" size={24} />
                    <span className="text-lg font-black tracking-wider uppercase">User Panel</span>
                </div>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop Blur Layer for Mobile View */}
            {isOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar (Responsive Overlay for Mobile, Fixed Column for Desktop) */}
            <aside className={`w-64 bg-purple-950 text-white p-6 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 shadow-2xl z-50 lg:z-10 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>

                <div className="space-y-8">
                    {/* Sidebar Header with Close Button for Mobile */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-5">
                        <div className="flex items-center gap-2.5">
                            <FolderHeart className="text-emerald-400" size={28} />
                            <span className="text-xl font-black tracking-wider uppercase">
                                User Panel
                            </span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex flex-col gap-2.5">
                        <NavLink to="/dashboard/my-requests" onClick={() => setIsOpen(false)} className={navLinkClass}>
                            <ClipboardList size={20} />
                            <span>My Requests</span>
                        </NavLink>

                        <NavLink to="/dashboard/add-pet" onClick={() => setIsOpen(false)} className={navLinkClass}>
                            <FilePlus size={20} />
                            <span>Add Pet</span>
                        </NavLink>

                        <NavLink to="/dashboard/my-listings" onClick={() => setIsOpen(false)} className={navLinkClass}>
                            <LayoutGrid size={20} />
                            <span>My Listings</span>
                        </NavLink>
                    </nav>
                </div>

                {/* Back to Home Navigation */}
                <div className="border-t border-white/10 pt-4">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 text-purple-200/70 hover:text-white hover:bg-white/10 rounded-xl transition font-bold"
                    >
                        <Home size={20} className="text-emerald-400" />
                        <span>Back to Home</span>
                    </Link>
                </div>

            </aside>

            {/* Content Area with Dynamic Padding */}
            <main className="flex-grow p-4 md:p-8 overflow-y-auto lg:h-screen bg-blue-50 w-full">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default DashboardLayout;
