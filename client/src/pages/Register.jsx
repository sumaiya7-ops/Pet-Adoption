import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { User, Mail, Image, Lock, ShieldCheck } from 'lucide-react';

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const photo = form.photo.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        // 🔒 রিকোয়ারমেন্ট অনুযায়ী পাসওয়ার্ড ভ্যালিডেশন লজিক
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long!');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error('Password must contain at least one uppercase letter!');
            return;
        }
        if (!/[a-z]/.test(password)) {
            toast.error('Password must contain at least one lowercase letter!');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Password and Confirm Password do not match!');
            return;
        }

        // ফায়ারবেসে ইউজার ক্রিয়েশন
        createUser(email, password)
            .then(() => {
                updateUserProfile(name, photo)
                    .then(() => {
                        toast.success('Account created successfully! 🐾');
                        form.reset();
                        navigate('/');
                    })
                    .catch(err => toast.error(err.message));
            })
            .catch(err => toast.error(err.message || 'Registration failed!'));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
                <h2 className="text-3xl font-black text-center text-white mb-1">Create Account</h2>
                <p className="text-slate-400 text-center text-xs mb-8">Join our secure pet adoption network</p>
                
                <form onSubmit={handleRegister} className="space-y-4 text-xs text-slate-300">
                    <div>
                        <label className="block font-semibold mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="text" name="name" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="John Doe" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="email" name="email" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="example@mail.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Photo URL</label>
                        <div className="relative">
                            <Image className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="url" name="photo" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="https://image-link.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="password" name="password" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="••••••••" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                            <input type="password" name="confirmPassword" required className="w-full bg-slate-800 text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="••••••••" />
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition duration-200 text-sm shadow-lg shadow-emerald-950/40 mt-4">
                        Register Account
                    </button>
                </form>

                <p className="text-center text-slate-400 text-xs mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 hover:underline font-bold">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
