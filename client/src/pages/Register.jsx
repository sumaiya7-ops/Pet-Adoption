import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react'; // 🐾 Check এবং X আইকন যোগ করা হয়েছে

const Register = () => {
    const { createUser, updateUserProfile, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // 🔍 রিয়েল-টাইম চেক করার জন্য কন্ডিশনগুলো
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    const handleRegister = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const photo = form.photo.value?.trim() || "https://www.gravatar.com/avatar/?d=mp";
        const confirmPassword = form.confirmPassword.value;

        // ফাইনাল ভ্যালিডেশন চেক
        if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
            return toast.error("পাসওয়ার্ডের সব শর্ত পূরণ করতে হবে!");
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        try {
            setLoading(true);
            await createUser(email, password);
            await updateUserProfile(name, photo);
            toast.success("🎉 Account created successfully!");
            form.reset();
            setPassword("");
            navigate("/");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onGoogleClick = async () => {
        try {
            await loginWithGoogle();
            toast.success("🎉 Google login successful!");
            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border rounded-3xl p-8 shadow-xl space-y-5">

                {/* Header */}
                <div className="text-center">
                    <UserPlus className="mx-auto text-purple-800" size={40} />
                    <h2 className="text-2xl font-black text-blue-900">Create Account</h2>
                </div>

                {/* Google Button */}
                <button onClick={onGoogleClick} className="w-full border p-3 rounded-xl font-bold hover:bg-gray-100">
                    Sign up with Google
                </button>

                <hr />

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-3">
                    <input name="name" type="text" placeholder="Full Name" required className="w-full p-3 border rounded-xl" />
                    <input name="email" type="email" placeholder="Email" required className="w-full p-3 border rounded-xl" />
                    <input name="photo" type="url" placeholder="Photo URL (optional)" className="w-full p-3 border rounded-xl" />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full p-3 border rounded-xl pr-10"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* 🐾 লাইভ পাসওয়ার্ড রিকোয়ারমেন্ট বক্স */}
                    {password && (
                        <div className="p-3 bg-gray-50 rounded-xl border text-xs space-y-1.5 transition-all">
                            <p className="font-bold text-gray-600 mb-1">Password Requirements:</p>
                            
                            <div className={`flex items-center gap-1.5 font-semibold ${hasMinLength ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {hasMinLength ? <Check size={14} /> : <X size={14} />} At least 6 characters
                            </div>
                            
                            <div className={`flex items-center gap-1.5 font-semibold ${hasUppercase ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {hasUppercase ? <Check size={14} /> : <X size={14} />} At least 1 uppercase letter (A-Z)
                            </div>
                            
                            <div className={`flex items-center gap-1.5 font-semibold ${hasLowercase ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {hasLowercase ? <Check size={14} /> : <X size={14} />} At least 1 lowercase letter (a-z)
                            </div>
                            
                            <div className={`flex items-center gap-1.5 font-semibold ${hasNumber ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {hasNumber ? <Check size={14} /> : <X size={14} />} At least 1 number (0-9)
                            </div>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="relative">
                        <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" required className="w-full p-3 border rounded-xl pr-10" />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-500">
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold p-3 rounded-xl disabled:opacity-50">
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm">
                    Already have account?{" "}
                    <Link className="text-emerald-600 font-bold" to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
