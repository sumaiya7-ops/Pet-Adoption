import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Eye, Edit3, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const [listings, setListings] = useState([]);
    const [stats, setStats] = useState({ totalListings: 0, available: 0, adopted: 0 });
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchListings = () => {
        axios.get(`http://localhost:5000/my-listings?email=${user?.email}`, { withCredentials: true })
            .then(res => {
                setListings(res.data.listings);
                setStats(res.data.stats);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (user?.email) fetchListings();
    }, [user]);

    const handleOpenRequests = (petId) => {
        setSelectedPetId(petId);
        axios.get(`http://localhost:5000/pet-requests/${petId}`, { withCredentials: true })
            .then(res => {
                setAdoptionRequests(res.data);
                setIsModalOpen(true);
            });
    };

    const handleApprove = (requestId) => {
        axios.patch(`http://localhost:5000/requests/approve/${requestId}`, { petId: selectedPetId }, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    toast.success('Adoption approved! Pet status updated to Adopted. 🐾');
                    setIsModalOpen(false);
                    fetchListings();
                }
            });
    };

    const handleReject = (requestId) => {
        axios.patch(`http://localhost:5000/requests/reject/${requestId}`, {}, { withCredentials: true })
            .then(() => {
                toast.warn('Adoption request rejected.');
                setAdoptionRequests(adoptionRequests.map(req => req._id === requestId ? { ...req, status: 'Rejected' } : req));
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this listing permanently?")) {
            axios.delete(`http://localhost:5000/pets/${id}`, { withCredentials: true })
                .then(() => {
                    toast.success('Listing deleted successfully.');
                    fetchListings();
                });
        }
    };

    return (
        <div className="space-y-8 bg-slate-950 min-h-screen text-slate-100">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Listings</h3>
                    <p className="text-4xl font-black text-white mt-2">{stats.totalListings}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Available</h3>
                    <p className="text-4xl font-black text-emerald-400 mt-2">{stats.available}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Adopted</h3>
                    <p className="text-4xl font-black text-blue-400 mt-2">{stats.adopted}</p>
                </div>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(pet => (
                    <div key={pet._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                        <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-white">{pet.name}</h4>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${pet.status === 'adopted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                    {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">Adoption Fee: <span className="text-emerald-400 font-bold">${pet.adoptionFee}</span></p>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button onClick={() => handleOpenRequests(pet._id)} className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl transition border border-slate-700">
                                    Requests
                                </button>
                                <Link to={`/pets/${pet._id}`} className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl transition border border-slate-700">
                                    <Eye size={15} /> View
                                </Link>
                                <button className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl transition border border-slate-700">
                                    <Edit3 size={15} /> Edit
                                </button>
                                <button onClick={() => handleDelete(pet._id)} className="flex items-center justify-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold py-2.5 px-3 rounded-xl transition border border-red-900/40">
                                    <Trash2 size={15} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Requests Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-black text-white mb-1">Adoption Applications</h3>
                        <p className="text-sm text-slate-400 mb-6">Manage incoming adoption forms for this pet listing.</p>

                        {adoptionRequests.length === 0 ? (
                            <p className="text-center text-slate-500 py-6 text-sm">No adoption requests received yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {adoptionRequests.map(req => (
                                    <div key={req._id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-white">{req.userName}</p>
                                            <p className="text-xs text-slate-400">Email: {req.userEmail}</p>
                                            <p className="text-xs text-emerald-400 font-medium">Pickup: {req.pickupDate}</p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {req.status === 'pending' || req.status === 'Pending' ? (
                                                <>
                                                    <button onClick={() => handleApprove(req._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition shadow-md w-full sm:w-auto">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(req._id)} className="bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-bold py-2 px-4 rounded-lg transition border border-slate-700 w-full sm:w-auto">
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
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
