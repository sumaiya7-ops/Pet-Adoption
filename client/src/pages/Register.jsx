import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
    const { createUser, updateUserProfile, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        const form = e.target;

        const name = form.name.value;
        const email = form.email.value;
        const photo =
            form.photo.value?.trim() ||
            "https://www.gravatar.com/avatar/?d=mp";
        const confirmPassword = form.confirmPassword.value;

        // Validation
        if (!password) return toast.error("Password দিতে হবে!");
        if (password.length < 6) return toast.error("Minimum 6 characters!");
        if (!/[A-Z]/.test(password)) return toast.error("At least 1 uppercase!");
        if (!/[a-z]/.test(password)) return toast.error("At least 1 lowercase!");
        if (!/[0-9]/.test(password)) return toast.error("At least 1 number!");
        if (password !== confirmPassword) return toast.error("Passwords do not match!");

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
                    <h2 className="text-2xl font-black text-blue-900">
                        Create Account
                    </h2>
                </div>

                {/* Google Button */}
                <button
                    onClick={onGoogleClick}
                    className="w-full border p-3 rounded-xl font-bold hover:bg-gray-100"
                >
                    Sign up with Google
                </button>

                <hr />

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-3">

                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full p-3 border rounded-xl"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-3 border rounded-xl"
                    />

                    <input
                        name="photo"
                        type="url"
                        placeholder="Photo URL (optional)"
                        className="w-full p-3 border rounded-xl"
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-3 border rounded-xl pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-3"
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full p-3 border rounded-xl pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-3"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white font-bold p-3 rounded-xl disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                </form>

                <p className="text-center text-sm">
                    Already have account?{" "}
                    <Link className="text-emerald-600 font-bold" to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;