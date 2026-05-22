import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, Trash2, CalendarDays } from 'lucide-react';

const MyRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);

    const baseUrl = import.meta.env.VITE_API_URL || 'https://pet-adoption-server-gamma.vercel.app';


    // ইউজারের নিজস্ব রিকোয়েস্টগুলো লোড করার ফাংশন
    const loadRequests = () => {
        axios.get(`${baseUrl}/my-requests?email=${user?.email}`, { withCredentials: true })
            .then(res => setRequests(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (user?.email) loadRequests();
    }, [user?.email]);

    // রিকোয়েস্ট ক্যানসেল বা ডিলিট করার লজিক
// রিকোয়েস্ট ক্যানসেল বা ডিলিট করার লজিক
const handleCancelRequest = async (id) => {
    const ok = window.confirm("Are you sure you want to cancel this request? 🐾");
    if (!ok) return;

    try {
        const res = await axios.delete(`${baseUrl}/requests/${id}`, { withCredentials: true });
        
        // যদি ডাটাবেজ থেকে সফলভাবে ডিলিট হয় (deletedCount: 1)
        if (res.data.deletedCount > 0) {
            toast.success("Request cancelled successfully! 🎉");
            
            // ইউআই থেকে সাথে সাথে রিমুভ করার জন্য স্টেট ফিল্টার
            const remaining = requests.filter(req => req._id !== id);
            setRequests(remaining);
        } else {
            toast.error("Something went wrong or request not found.");
        }
    } catch (err) {
        console.error(err);
        toast.error("Failed to cancel request");
    }
};


    return (
        <div className="container mx-auto px-4 py-4 bg-blue-50 min-h-screen">
            {/* মূল কার্ড প্যানেল যা আপনার থিমের সাথে শতভাগ ম্যাচড */}
            <div className="bg-white border border-indigo-100 p-8 rounded-3xl shadow-xl min-h-[60vh] space-y-6">
                
                {/* হেডার সেকশন */}
                <div className="flex items-center gap-3 border-b border-indigo-50 pb-5 mb-2">
                    <CalendarDays className="text-purple-800" size={32} />
                    <div>
                        <h2 className="text-3xl font-black text-blue-900 tracking-tight">My Adoption Requests</h2>
                        <p className="text-purple-900/60 font-semibold text-sm mt-0.5">Track the status of the pets you have applied to adopt.</p>
                    </div>
                </div>

                {requests.length === 0 ? (
                    <div className="text-center py-16 text-purple-900/60 font-bold text-base bg-indigo-50/30 rounded-2xl border border-dashed border-indigo-200">
                        You haven't submitted any adoption requests yet. 
                        <Link to="/all-pets" className="text-emerald-600 hover:text-purple-900 hover:underline block mt-3 font-black transition-all">
                            Browse Pets Now →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-indigo-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-indigo-50/60 border-b border-indigo-100 text-blue-900 text-xs font-black uppercase tracking-wider">
                                    <th className="py-4 px-6">Pet Name</th>
                                    <th className="py-4 px-6">Pickup Date</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-50 text-sm font-bold text-gray-700">
                                {requests.map(req => (
                                    <tr key={req._id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="py-4 px-6 font-black text-blue-900 group-hover:text-purple-900 transition-colors">{req.petName}</td>
                                        
                                        {/* 🔄 এই লাইনে পরিবর্তন করা হয়েছে: ডেট ফাঁকা থাকলে "Not Specified" দেখাবে */}
                                        <td className="py-4 px-6 text-purple-950/70 font-semibold">
                                            {req.pickupDate || "Not Specified"}
                                        </td>
                                        
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${
                                                req.status === 'Approved' 
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                                    : req.status === 'Rejected' 
                                                    ? 'bg-red-100 text-red-800 border-red-200' 
                                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right flex justify-end gap-2.5">
                                            {/* ভিউ বাটন */}
                                            <Link to={`/pets/${req.petId}`} className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-emerald-600 text-purple-900 hover:text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all border border-indigo-100 hover:border-emerald-500 shadow-sm active:scale-95">
                                                <Eye size={14} /> View
                                            </Link>
                                            
                                            {/* ক্যানসেল বাটন */}
                                            <button onClick={() => handleCancelRequest(req._id)} className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all border border-red-100 hover:border-red-500 shadow-sm active:scale-95">
                                                <Trash2 size={14} /> Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRequests;
