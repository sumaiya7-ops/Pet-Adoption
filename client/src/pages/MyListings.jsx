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

    const loadRequests = () => {
        axios.get(`${baseUrl}/my-requests?email=${user?.email}`, { withCredentials: true })
            .then(res => setRequests(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (user?.email) loadRequests();
    }, [user?.email]);

    const handleCancelRequest = async (id) => {
        const ok = window.confirm("Are you sure you want to cancel this request? 🐾");
        if (!ok) return;

        try {
            const res = await axios.delete(`${baseUrl}/requests/${id}`, { withCredentials: true });
            
            if (res.data.deletedCount > 0) {
                toast.success("Request cancelled successfully! 🎉");
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
        <div className="container mx-auto px-2 sm:px-4 py-4 bg-blue-50 min-h-screen">
          
            <div className="bg-white border border-indigo-100 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl min-h-[60vh] space-y-6">
              
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-indigo-50 pb-5 mb-2">
                    <CalendarDays className="text-purple-800 shrink-0" size={32} />
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight">My Adoption Requests</h2>
                        <p className="text-purple-900/60 font-semibold text-xs sm:text-sm mt-0.5">Track the status of the pets you have applied to adopt.</p>
                    </div>
                </div>

                {requests.length === 0 ? (
                    <div className="text-center py-16 text-purple-900/60 font-bold text-sm sm:text-base bg-indigo-50/30 rounded-2xl border border-dashed border-indigo-200 px-4">
                        You haven't submitted any adoption requests yet. 
                        <Link to="/all-pets" className="text-emerald-600 hover:text-purple-900 hover:underline block mt-3 font-black transition-all">
                            Browse Pets Now →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-indigo-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse block md:table">                       
                            <thead className="block md:table-header-group hidden md:table-row-group">
                                <tr className="bg-indigo-50/60 border-b border-indigo-100 text-blue-900 text-xs font-black uppercase tracking-wider block md:table-row">
                                    <th className="py-4 px-6 block md:table-cell">Pet Name</th>
                                    <th className="py-4 px-6 block md:table-cell">Pickup Date</th>
                                    <th className="py-4 px-6 block md:table-cell">Status</th>
                                    <th className="py-4 px-6 text-right block md:table-cell">Actions</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-indigo-50 text-sm font-bold text-gray-700 block md:table-row-group">
                                {requests.map(req => (
                                    <tr key={req._id} className="hover:bg-indigo-50/20 transition-colors group block md:table-row py-4 px-4 md:py-0 md:px-0 space-y-3 md:space-y-0">
                                        
                                        {/* Pet Name */}
                                        <td className="block md:table-cell md:py-4 md:px-6 font-black text-blue-900 group-hover:text-purple-900 transition-colors before:content-['Pet_Name:_'] before:md:content-none before:text-xs before:text-gray-400 before:font-semibold">
                                            <span className="md:inline block">{req.petName}</span>
                                        </td>
                                        
                                        {/* Pickup Date */}
                                        <td className="block md:table-cell md:py-4 md:px-6 text-purple-950/70 font-semibold before:content-['Pickup_Date:_'] before:md:content-none before:text-xs before:text-gray-400 before:font-semibold">
                                            <span className="md:inline block">{req.pickupDate || "Not Specified"}</span>
                                        </td>
                                        
                                        {/* Status */}
                                        <td className="block md:table-cell md:py-4 md:px-6 before:content-['Status:_'] before:md:content-none before:text-xs before:text-gray-400 before:font-semibold">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide border ${
                                                req.status === 'Approved' 
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                                    : req.status === 'Rejected' 
                                                    ? 'bg-red-100 text-red-800 border-red-200' 
                                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="block md:table-cell md:py-4 md:px-6 md:text-right">
                                            <div className="flex justify-start md:justify-end gap-2">                                          
                                                <Link to={`/pets/${req.petId}`} className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-emerald-600 text-purple-900 hover:text-white text-xs font-black py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition-all border border-indigo-100 hover:border-emerald-500 shadow-sm active:scale-95">
                                                    <Eye size={14} /> View
                                                </Link>                                                                                       
                                          
                                                <button onClick={() => handleCancelRequest(req._id)} className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-black py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition-all border border-red-100 hover:border-red-500 shadow-sm active:scale-95">
                                                    <Trash2 size={14} /> Cancel
                                                </button>
                                            </div>
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
