import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FilePlus, ClipboardList, Home, FolderHeart } from 'lucide-react';

const DashboardLayout = () => {
    // অ্যাক্টিভ লিংকের জন্য প্রিমিয়াম ইমারল্ড কালার স্টাইল
    const activeStyle = ({ isActive }) => 
        `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            isActive 
                ? "bg-emerald-600/20 text-emerald-400 font-bold border-l-4 border-emerald-500 shadow-lg shadow-emerald-950/50" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* 🛠️ Dashboard Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div className="space-y-8">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-5">
                        <FolderHeart className="text-emerald-500" size={28} />
                        <span className="text-xl font-black tracking-wider text-white">USER PANEL</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
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

                {/* Bottom Utility link to return Home */}
                <div className="border-t border-slate-800 pt-4">
                    <Link to="/" className="flex items-center gap-3 p-3 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-all duration-200 font-semibold">
                        <Home size={20} />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* 🖥️ Dynamic Content Workspace */}
            <main className="flex-grow p-10 overflow-y-auto h-screen bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
