import { Link } from 'react-router-dom';
import { Home, ShieldAlert } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50 text-center px-6 transition-all duration-300">
                     <div className="bg-white p-10 rounded-3xl border border-indigo-100 shadow-2xl flex flex-col items-center max-w-md">
                <ShieldAlert className="text-red-500 w-20 h-20 animate-bounce mb-2" />
                
                <h1 className="text-7xl font-black text-blue-900 tracking-widest">404</h1>
                <h2 className="text-2xl font-black text-purple-950 mt-2 tracking-tight">Oops! Page Not Found</h2>
                
                <p className="text-purple-900/60 font-semibold mt-3 text-sm leading-relaxed">
                    The destination you are trying to access does not exist or has been removed from our adoption server.
                </p>                
              
                <Link to="/" className="mt-6 flex items-center gap-2 bg-emerald-600 hover:bg-purple-900 text-white text-sm font-black px-6 py-3.5 rounded-xl transition duration-300 shadow-md active:scale-95">
                    <Home size={16} /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
