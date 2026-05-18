import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, Trash2, CalendarDays } from 'lucide-react';

const MyRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);

    // ইউজারের নিজস্ব রিকোয়েস্টগুলো লোড করার ফাংশন
    const loadRequests = () => {
        axios.get(`http://localhost:5000/my-requests?email=${user?.email}`, { withCredentials: true })
            .then(res => setRequests(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (user?.email) loadRequests();
    }, [user]);

    // রিকোয়েস্ট ক্যানসেল বা ডিলিট করার লজিক
    const handleCancelRequest = (id) => {
        if (window.confirm("Are you sure you want to cancel this adoption request?")) {
            axios.delete(`http://localhost:5000/requests/${id}`, { withCredentials: true })
                .then(() => {
                    toast.success('Adoption request cancelled successfully.');
                    loadRequests(); // তালিকা রিফ্রেশ করুন
                })
                .catch(() => toast.error('Failed to cancel request.'));
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl min-h-[60vh]">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5 mb-6">
                <CalendarDays className="text-emerald-500" size={28} />
                <div>
                    <h2 className="text-2xl font-black text-white">My Adoption Requests</h2>
                    <p className="text-slate-400 text-sm">Track the status of the pets you have applied to adopt.</p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                    You haven't submitted any adoption requests yet. 
                    <Link to="/all-pets" className="text-emerald-400 hover:underline block mt-2 font-medium">Browse pets now</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="pb-4">Pet Name</th>
                                <th className="pb-4">Pickup Date</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                            {requests.map(req => (
                                <tr key={req._id} className="hover:bg-slate-850/40 transition-colors">
                                    <td className="py-4 font-semibold text-white">{req.petName}</td>
                                    <td className="py-4 text-slate-400">{req.pickupDate}</td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            req.status === 'Approved' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                : req.status === 'Rejected' 
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right flex justify-end gap-2">
                                        <Link to={`/pets/${req.petId}`} className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl transition border border-slate-700">
                                            <Eye size={14} /> View
                                        </Link>
                                        <button onClick={() => handleCancelRequest(req._id)} className="inline-flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold py-2 px-3 rounded-xl transition border border-red-900/40">
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
    );
};

export default MyRequests;
