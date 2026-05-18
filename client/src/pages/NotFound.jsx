import { Link } from 'react-router-dom';
import { Home, ShieldAlert } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-center px-6">
            <ShieldAlert className="text-red-500 w-20 h-20 animate-bounce mb-4" />
            <h1 className="text-7xl font-black text-white tracking-widest">404</h1>
            <h2 className="text-2xl font-bold text-slate-300 mt-2">Oops! Page Not Found</h2>
            <p className="text-slate-500 mt-2 max-w-sm text-xs leading-relaxed">
                The destination you are trying to access does not exist or has been removed from our adoption server.
            </p>
            <Link to="/" className="mt-6 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-950/40">
                <Home size={16} /> Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
