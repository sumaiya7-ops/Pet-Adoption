import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const { loginUser, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // রিডাইরেকশন পাথ হ্যান্ডলিং (প্রাইভেট রাউটের রিলোড প্রটেকশন)
    const from = location.state?.from?.pathname || "/";

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        loginUser(email, password)
            .then(() => {
                toast.success('Welcome back! Login successful ✨');
                navigate(from, { replace: true });
            })
            .catch(err => {
                toast.error(err.message || 'Invalid credentials. Please try again.');
            });
    };

    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then(() => {
                toast.success('Google Login successful! 🚀');
                navigate(from, { replace: true });
            })
            .catch(err => toast.error(err.message));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
                <h2 className="text-3xl font-black text-center text-white mb-1">Welcome Back</h2>
                <p className="text-slate-400 text-center text-xs mb-8">Sign in to resume pet adoptions</p>
                
                <form onSubmit={handleLogin} className="space-y-4 text-xs text-slate-300">
                    <div>
                        <label className="block font-semibold mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="email" name="email" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="example@mail.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="password" name="password" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="••••••••" />
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition duration-200 text-sm shadow-lg shadow-emerald-950/40 mt-4">
                        Sign In
                    </button>
                </form>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-600 text-xs font-bold">OR</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold py-3.5 rounded-xl transition border border-slate-700 text-xs flex justify-center items-center gap-2.5 shadow-md">
                    <img src="https://svgrepo.com" alt="google" className="w-4 h-4" />
                    Continue with Google
                </button>

                <p className="text-center text-slate-400 text-xs mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-emerald-400 hover:underline font-bold">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
