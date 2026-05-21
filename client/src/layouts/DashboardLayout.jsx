import { Link, NavLink, Outlet } from 'react-router-dom';
import { ClipboardList, FilePlus, LayoutGrid, Home, FolderHeart } from 'lucide-react';

const DashboardLayout = () => {
    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 p-3.5 rounded-xl font-bold transition-all duration-300 ${
            isActive
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 border-l-4 border-white transform translate-x-1"
                : "text-purple-200/70 hover:bg-white/10 hover:text-white"
        }`;

    return (
        <div className="flex min-h-screen bg-blue-50 text-slate-900 font-sans">

            {/* Sidebar */}
            <aside className="w-64 bg-purple-950 text-white p-6 flex flex-col justify-between h-screen sticky top-0 shadow-2xl">

                <div className="space-y-8">

                    {/* Header */}
                    <div className="flex items-center gap-2.5 border-b border-white/10 pb-5">
                        <FolderHeart className="text-emerald-400" size={28} />
                        <span className="text-xl font-black tracking-wider uppercase">
                            User Panel
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-col gap-2.5">
                        <NavLink to="/dashboard/my-requests" className={navLinkClass}>
                            <ClipboardList size={20} />
                            <span>My Requests</span>
                        </NavLink>

                        <NavLink to="/dashboard/add-pet" className={navLinkClass}>
                            <FilePlus size={20} />
                            <span>Add Pet</span>
                        </NavLink>

                        <NavLink to="/dashboard/my-listings" className={navLinkClass}>
                            <LayoutGrid size={20} />
                            <span>My Listings</span>
                        </NavLink>
                    </nav>
                </div>

                {/* Home */}
                <div className="border-t border-white/10 pt-4">
                    <Link
                        to="/"
                        className="flex items-center gap-3 p-3 text-purple-200/70 hover:text-white hover:bg-white/10 rounded-xl transition font-bold"
                    >
                        <Home size={20} className="text-emerald-400" />
                        <span>Back to Home</span>
                    </Link>
                </div>

            </aside>

            {/* Content */}
            <main className="flex-grow p-8 overflow-y-auto h-screen bg-blue-50">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default DashboardLayout;