import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Mail, LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { loginUser, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // পাসওয়ার্ডের স্টেট হ্যান্ডলিং (রেজিস্টার পেজের মতো হুবহু ম্যাচড)
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const from = location.state?.from?.pathname || "/";

    // সাধারণ লগইন হ্যান্ডলার
    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;

        const email = form.email.value;

        loginUser(email, password)
            .then(() => {
                // 🎉 লগইনেও স্পেশাল অভিনন্দন ও শুভেচ্ছা টোস্ট
                toast.success("🎉 Congratulations! Welcome back to your pet adoption journey. Login successful! 🐾", {
                    position: "top-center",
                    autoClose: 4000,
                    theme: "colored"
                });
                navigate(from, { replace: true });
            })
            .catch(err => toast.error(err.message));
    };

    // গুগল লগইন হ্যান্ডলার
    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then(() => {
                // 🎉 গুগল লগইনেও স্পেশাল অভিনন্দন টোস্ট
                toast.success("🎉 Congratulations! Google login successful. Welcome back aboard! 🐾", {
                    position: "top-center",
                    autoClose: 4000,
                    theme: "colored"
                });
                navigate(from, { replace: true });
            })
            .catch(err => toast.error(err.message));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 transition-all duration-300">
            {/* মূল লাক্সারিয়াস কার্ড প্যানেল */}
            <div className="w-full max-w-md bg-white border border-indigo-100 shadow-2xl rounded-3xl p-8 space-y-5">

                {/* হেডার লোগো ও টেক্সট */}
                <div className="text-center space-y-1.5">
                    <div className="mx-auto bg-indigo-50 text-purple-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                        <LogIn size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-blue-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-purple-900/60 font-semibold text-xs">
                        Login to continue your pet adoption journey 🐾
                    </p>
                </div>

                {/* 🔴 GOOGLE CONTINUE BUTTON (রেজিস্টার পেজের মতো হুবহু ম্যাচড) */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-indigo-50/50 text-gray-700 font-bold py-3.5 px-4 rounded-xl border border-indigo-200 shadow-sm flex items-center justify-center gap-3 transition duration-200 active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.84 2.98C6.01 7.27 8.79 5.04 12 5.04z"/>
                        <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.47c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.58z"/>
                        <path fill="#FBBC05" d="M5.08 14.7C4.83 13.93 4.69 13.11 4.69 12.25s.14-1.68.39-2.45L1.24 6.82C.45 8.41 0 10.23 0 12.25s.45 3.84 1.24 5.43l3.84-2.98z"/>
                        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.7-2.87c-1.11.75-2.53 1.19-4.26 1.19-3.21 0-5.99-2.23-6.96-5.66l-3.84 2.98C3.2 20.27 7.24 23 12 23z"/>
                    </svg>
                    <span>Continue with Google</span>
                </button>

                {/* --- OR --- Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-indigo-100"></div>
                    <span className="px-3 text-xs font-bold text-purple-900/40 uppercase">or</span>
                    <div className="flex-grow border-t border-indigo-100"></div>
                </div>

                {/* লগইন ফর্ম */}
                <form onSubmit={handleLogin} className="space-y-4 text-sm">

                    {/* EMAIL INPUT */}
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email Address"
                            className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 pl-11 py-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                        />
                        <Mail className="absolute left-3.5 top-4 text-purple-900/40 w-4 h-4" />
                    </div>

                    {/* PASSWORD INPUT WITH SHOW/HIDE LOGIC */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 py-3.5 pr-12 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3.5 top-3.5 text-purple-900/50 hover:text-purple-900 p-0.5 rounded-lg transition-colors"
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* SUBMIT BUTTON (সিগনেচার এমারেল্ড গ্রিন) */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-purple-900 text-white font-black p-3.5 rounded-xl transition duration-300 shadow-xl shadow-emerald-950/10 active:scale-[0.98] mt-2 text-sm"
                    >
                        Sign In
                    </button>

                </form>

                {/* ফুটার লিঙ্ক */}
                <p className="text-center text-purple-900/60 font-semibold text-xs pt-2">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-emerald-600 hover:text-purple-900 font-black transition-colors ml-1">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
