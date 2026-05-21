import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
    // AuthProvider এর আসল ফাংশন 'loginWithGoogle' এখানে রিসিভ করা হলো
    const { createUser, updateUserProfile, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ফর্ম সাবমিট (ইমেইল-পাসওয়ার্ড) হ্যান্ডলার
    const handleRegister = (e) => {
        e.preventDefault();
        const form = e.target;

        const name = form.name.value;
        const email = form.email.value;
        const photo = form.photo.value || "https://ibb.co";
        const confirmPassword = form.confirmPassword.value;

        // ভ্যালিডেশন চেক
        if (password.length < 6) return toast.error("⏳ Minimum 6 characters required!");
        if (!/[A-Z]/.test(password)) return toast.error("🔠 At least one uppercase letter required!");
        if (!/[a-z]/.test(password)) return toast.error("🔡 At least one lowercase letter required!");
        if (!/[0-9]/.test(password)) return toast.error("🔢 At least one number required!");
        if (password !== confirmPassword) return toast.error("❌ Passwords do not match!");

        createUser(email, password)
            .then(() => {
                updateUserProfile(name, photo)
                    .then(() => {
                        // 🎉 স্পেশাল অভিনন্দন টোস্ট বার্তা
                        toast.success("🎉 Congratulations! Your account has been created successfully. Welcome to the Pet Adoption Family! 🐾", {
                            position: "top-center",
                            autoClose: 4000,
                            theme: "colored"
                        });
                        form.reset();
                        setPassword("");
                        navigate("/");
                    });
            })
            .catch(err => toast.error(err.message));
    };

    // গুগল লগইন হ্যান্ডলার
    const onGoogleClick = () => {
        if (loginWithGoogle) {
            loginWithGoogle()
                .then(() => {
                    // 🎉 গুগল ইউজারের জন্যও অভিনন্দন টoস্ট বার্তা
                    toast.success("🎉 Congratulations! Successfully signed in with Google. Welcome aboard! 🐾", {
                        position: "top-center",
                        autoClose: 4000,
                        theme: "colored"
                    });
                    navigate("/");
                })
                .catch(err => toast.error(err.message));
        } else {
            toast.error("Google login function not found in AuthProvider!");
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6 transition-all duration-300">
            {/* মূল লাক্সারিয়াস কার্ড প্যানেল */}
            <div className="w-full max-w-md bg-white border border-indigo-100 rounded-3xl p-8 shadow-2xl space-y-5">

                {/* হেডার লোগো ও টেক্সট */}
                <div className="text-center space-y-1.5">
                    <div className="mx-auto bg-indigo-50 text-purple-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-blue-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-purple-900/60 font-semibold text-xs">
                        Join Pet Adoption Family 🐾
                    </p>
                </div>

                {/* 🔴 GOOGLE SIGN UP BUTTON */}
                <button
                    type="button"
                    onClick={onGoogleClick}
                    className="w-full bg-white hover:bg-indigo-50/50 text-gray-700 font-bold py-3.5 px-4 rounded-xl border border-indigo-200 shadow-sm flex items-center justify-center gap-3 transition duration-200 active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.84 2.98C6.01 7.27 8.79 5.04 12 5.04z"/>
                        <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.47c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.58z"/>
                        <path fill="#FBBC05" d="M5.08 14.7C4.83 13.93 4.69 13.11 4.69 12.25s.14-1.68.39-2.45L1.24 6.82C.45 8.41 0 10.23 0 12.25s.45 3.84 1.24 5.43l3.84-2.98z"/>
                        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.7-2.87c-1.11.75-2.53 1.19-4.26 1.19-3.21 0-5.99-2.23-6.96-5.66l-3.84 2.98C3.2 20.27 7.24 23 12 23z"/>
                    </svg>
                    <span>Sign up with Google</span>
                </button>

                {/* --- OR --- Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-indigo-100"></div>
                    <span className="px-3 text-xs font-bold text-purple-900/40 uppercase">or</span>
                    <div className="flex-grow border-t border-indigo-100"></div>
                </div>

                {/* রেজিস্ট্রেশন ফর্ম */}
                <form onSubmit={handleRegister} className="space-y-4 text-sm">

                    {/* NAME */}
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Full Name"
                        className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 py-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                    />

                    {/* EMAIL */}
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email Address"
                        className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 py-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                    />

                    {/* PHOTO */}
                    <input
                        name="photo"
                        type="url"
                        placeholder="Photo URL (optional)"
                        className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 py-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                    />

                    {/* PASSWORD */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
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

                    {/* LIVE PASSWORD CHECK PANEL */}
                    <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-bold">
                        <p className={`flex items-center gap-1.5 transition-colors ${password.length >= 6 ? "text-emerald-600" : "text-red-500"}`}>
                            <span>{password.length >= 6 ? "●" : "○"}</span> 6+ characters
                        </p>
                        <p className={`flex items-center gap-1.5 transition-colors ${/[A-Z]/.test(password) ? "text-emerald-600" : "text-red-500"}`}>
                            <span>{/[A-Z]/.test(password) ? "●" : "○"}</span> Uppercase
                        </p>
                        <p className={`flex items-center gap-1.5 transition-colors ${/[a-z]/.test(password) ? "text-emerald-600" : "text-red-500"}`}>
                            <span>{/[a-z]/.test(password) ? "●" : "○"}</span> Lowercase
                        </p>
                        <p className={`flex items-center gap-1.5 transition-colors ${/[0-9]/.test(password) ? "text-emerald-600" : "text-red-500"}`}>
                            <span>{/[0-9]/.test(password) ? "●" : "○"}</span> Need Number
                        </p>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 py-3.5 pr-12 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3.5 top-3.5 text-purple-900/50 hover:text-purple-900 p-0.5 rounded-lg transition-colors"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-purple-900 text-white font-black p-3.5 rounded-xl transition duration-300 shadow-xl shadow-emerald-950/10 active:scale-[0.98] mt-2 text-sm"
                    >
                        Create Account
                    </button>

                </form>

                {/* ফুটার লিঙ্ক */}
                <p className="text-center text-purple-900/60 font-semibold text-xs pt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-600 hover:text-purple-900 font-black transition-colors ml-1">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;

