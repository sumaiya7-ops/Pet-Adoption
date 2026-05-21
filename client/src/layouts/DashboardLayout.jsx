import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FilePlus, ClipboardList, Home, FolderHeart } from 'lucide-react';

const DashboardLayout = () => {
    // অ্যাক্টিভ ও ইন-অ্যাক্টিভ লিংকের জন্য লাক্সারি পার্পল ও এমারেল্ড মিক্সড স্টাইল
    const activeStyle = ({ isActive }) => 
        `flex items-center gap-3 p-3.5 rounded-xl font-bold transition-all duration-300 ${
            isActive 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 border-l-4 border-white transform translate-x-1" 
                : "text-purple-200/70 hover:bg-white/10 hover:text-white transition-all"
        }`;

    return (
        <div className="flex min-h-screen bg-blue-50 text-slate-900 font-sans transition-all duration-300">
            
            {/* 🛠️ Dashboard Sidebar (ডার্ক স্লেট পরিবর্তন করে ডিপ পার্পল থিম দেওয়া হলো) */}
            <aside className="w-64 bg-purple-950 text-white p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-2xl">
                <div className="space-y-8">
                    
                    {/* Brand Logo & Title Panel */}
                    <div className="flex items-center gap-2.5 border-b border-white/10 pb-5">
                        <FolderHeart className="text-emerald-400 animate-pulse" size={28} />
                        <span className="text-xl font-black tracking-wider text-white uppercase">User Panel</span>
                    </div>

                    {/* Navigation Menu Links */}
                    <nav className="flex flex-col gap-2.5">
                        <NavLink to="/dashboard/my-requests" className={activeStyle}>
                            <ClipboardList size={20} />
                            <span>My Requests</span>
                        </NavLink>
                        
                        <NavLink to="/dashboard/add-pet" className={activeStyle}>
                            <FilePlus size={20} />
                            <span>Add Pet</span>
                        </NavLink>
                        
                        <NavLink to="/dashboard/my-listings" className={activeStyle}>
                            <LayoutDashboard size={20} />
                            <span>My Listings</span>
                        </NavLink>
                    </nav>
                </div>

                {/* Bottom Utility: Back to Home Button */}
                <div className="border-t border-white/10 pt-4">
                    <Link to="/" className="flex items-center gap-3 p-3 text-purple-200/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-bold active:scale-95">
                        <Home size={20} className="text-emerald-400" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* 🖥️ Dynamic Content Workspace (মূল কন্টেন্ট ব্যাকগ্রাউন্ডও লাইট থিম করা হলো) */}
            <main className="flex-grow p-8 overflow-y-auto h-screen bg-blue-50">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

