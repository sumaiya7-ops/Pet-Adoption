import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Eye, Edit3, Trash2, X, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const [listings, setListings] = useState([]);
    const [stats, setStats] = useState({ totalListings: 0, available: 0, adopted: 0 });
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL || 'https://pet-adoption-server-gamma.vercel.app';


    const fetchListings = () => {
        axios.get(`${baseUrl}/my-listings?email=${user?.email}`, { withCredentials: true })
            .then(res => {
               setListings(res.data.listings || []);
           setStats(res.data.stats || { totalListings: 0, available: 0, adopted: 0 });
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (user?.email) fetchListings();
    }, [user?.email]);

    const handleOpenRequests = (petId) => {
        setSelectedPetId(petId);
        axios.get(`${baseUrl}/pet-requests/${petId}`, { withCredentials: true })
            .then(res => {
                setAdoptionRequests(res.data);
                setIsModalOpen(true);
            });
    };

    const handleApprove = (requestId) => {
        axios.patch(`${baseUrl}/requests/approve/${requestId}`, { petId: selectedPetId }, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    toast.success('Adoption approved! 🎉');
                    setIsModalOpen(false);
                    fetchListings();
                }
            });
    };

    const handleReject = (requestId) => {
        axios.patch(`${baseUrl}/requests/reject/${requestId}`, {}, { withCredentials: true })
            .then(() => {
                toast.warn('Request rejected');
                setAdoptionRequests(adoptionRequests.map(req =>
                    req._id === requestId ? { ...req, status: 'Rejected' } : req
                ));
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this pet listing permanently?")) {
            axios.delete(`${baseUrl}/pets/${id}`, { withCredentials: true })
                .then(() => {
                    toast.success('Deleted successfully 🐾');
                    fetchListings();
                });
        }
    };

    return (
        <div className="space-y-10 bg-blue-50 min-h-screen text-slate-900 px-6 py-8 transition-all duration-300">

            {/* 📊 STATS PANEL WITH PRO MAX LUXURY LOOK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Listings Card */}
                <div className="bg-white border border-indigo-100 p-6 rounded-3xl text-center shadow-md hover:shadow-xl transition duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-600"></div>
                    <h3 className="text-purple-900/60 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <Layers size={14} className="text-purple-600" /> Total Listings
                    </h3>
                    <p className="text-4xl font-black text-blue-900 mt-2 group-hover:scale-105 transition-transform">{stats.totalListings}</p>
                </div>

                {/* Available Card */}
                <div className="bg-white border border-indigo-100 p-6 rounded-3xl text-center shadow-md hover:shadow-xl transition duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <h3 className="text-emerald-700/70 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Available
                    </h3>
                    <p className="text-4xl font-black text-emerald-600 mt-2 group-hover:scale-105 transition-transform">{stats.available}</p>
                </div>

                {/* Adopted Card */}
                <div className="bg-white border border-indigo-100 p-6 rounded-3xl text-center shadow-md hover:shadow-xl transition duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <h3 className="text-blue-700/70 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <AlertCircle size={14} className="text-blue-500" /> Adopted
                    </h3>
                    <p className="text-4xl font-black text-blue-600 mt-2 group-hover:scale-105 transition-transform">{stats.adopted}</p>
                </div>

            </div>

            {/* 🐾 LISTINGS DYNAMIC CARD GRID */}
            {listings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-indigo-100 max-w-xl mx-auto shadow-lg">
                    <p className="text-purple-900/60 text-base font-bold">You haven't listed any pets for adoption yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map(pet => (
                        <div
                            key={pet._id}
                            className="bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={pet.image}
                                    alt={pet.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                                />
                                <span className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-wider backdrop-blur-sm shadow-sm border ${
                                    pet.status === 'adopted'
                                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                                        : 'bg-purple-800 text-white border-purple-900'
                                }`}>
                                    {pet.status}
                                </span>
                            </div>

                            <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h4 className="text-2xl font-black text-blue-900 group-hover:text-purple-900 transition-colors">{pet.name}</h4>
                                    <p className="text-sm text-purple-950 font-bold mt-1">
                                        Adoption Fee: <span className="text-red-500 font-black">${pet.adoptionFee}</span>
                                    </p>
                                </div>

                                {/* 🎛️ DYNAMIC ACTION BUTTON PANEL */}
                                <div className="grid grid-cols-2 gap-2.5 pt-2">
                                    <button
                                        onClick={() => handleOpenRequests(pet._id)}
                                        className="bg-indigo-50 hover:bg-purple-900 text-purple-900 hover:text-white text-xs font-black py-2.5 rounded-xl border border-indigo-100 hover:border-purple-950 transition-all shadow-sm active:scale-95"
                                    >
                                        Requests
                                    </button>

                                    <Link
                                        to={`/pets/${pet._id}`}
                                        className="bg-indigo-50 hover:bg-emerald-600 text-purple-900 hover:text-white text-xs font-black py-2.5 rounded-xl border border-indigo-100 hover:border-emerald-500 flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                    >
                                        <Eye size={14} /> View
                                    </Link>

                                    <button className="bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white text-xs font-black py-2.5 rounded-xl border border-amber-100 hover:border-amber-500 transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95">
                                        <Edit3 size={14} /> Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(pet._id)}
                                        className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-black py-2.5 rounded-xl border border-red-100 hover:border-red-500 transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🔮 SLICK & EYE-SOOTHING APPLICATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white border border-indigo-100 rounded-3xl w-full max-w-2xl p-6 relative shadow-2xl transform scale-100 transition-all duration-300">
                        
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-purple-900/50 hover:text-purple-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <h3 className="text-2xl font-black text-blue-900 tracking-tight">
                            Adoption Applications
                        </h3>
                        <p className="text-sm text-purple-900/60 font-semibold mb-6">
                            Manage candidate profiles who want to adopt your pet
                        </p>

                        {adoptionRequests.length === 0 ? (
                            <div className="text-center py-10 bg-indigo-50/20 rounded-2xl border border-dashed border-indigo-200">
                                <p className="text-purple-900/50 font-bold text-sm">No applications submitted for this companion yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                {adoptionRequests.map(req => (
                                    <div
                                        key={req._id}
                                        className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-200 transition-colors"
                                    >
                                        <div className="space-y-0.5">
                                            <p className="text-blue-900 font-black text-base">{req.userName}</p>
                                            <p className="text-xs text-purple-950/70 font-semibold">{req.userEmail}</p>
                                            <p className="text-xs text-emerald-600 font-bold pt-1 flex items-center gap-1">
                                                📅 Target Pickup: {req.pickupDate}
                                            </p>
                                            {req.message && (
                                                <p className="text-xs text-gray-600 mt-2 bg-white/80 p-2 rounded-xl border border-indigo-50 italic">
                                                    "{req.message}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 self-end sm:self-center">
                                            {req.status === 'Pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req._id)}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(req._id)}
                                                        className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-black px-4 py-2.5 rounded-xl border border-red-100 hover:border-red-500 transition active:scale-95"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-wide border ${
                                                    req.status === 'Approved' 
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                                        : 'bg-red-100 text-red-800 border-red-200'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default MyListings;
