
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MapPin, ShieldAlert, Heart, Calendar } from 'lucide-react';
import { petInfo } from '../data/petInfo';

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);

   
    useEffect(() => {
        axios.get(`http://https://pet-adoption-server-gamma.vercel.app
/pets/${id}`)
            .then(res => setPet(res.data))
            .catch(err => console.error(err));
    }, [id]);

const info = petInfo[pet?.species];

    if (!pet) {
        return (
            <div className="flex justify-center items-center h-[60vh] bg-slate-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500"></div>
            </div>
        );
    }

    // ওনার চেক করা (মালিক নিজে রিকোয়েস্ট দিতে পারবে না)
    const isOwner = pet.ownerEmail === user?.email;

    const handleAdoptionSubmit = (e) => {
        e.preventDefault();

        if (isOwner) {
            toast.error("Adoption Control: You cannot submit an adoption request for your own listed pet!");
            return;
        }

        const form = e.target;
        const adoptionData = {
            petId: pet._id,
            petName: pet.name,
            userName: user?.displayName || "Anonymous",
            userEmail: user?.email,
            pickupDate: form.pickupDate.value,
            message: form.message.value,
            status: "Pending" // ডিফল্ট স্ট্যাটাস
        };

        axios.post('http://https://pet-adoption-server-gamma.vercel.app
/requests', adoptionData, { withCredentials: true })
            .then(res => {
                if (res.data.insertedId) {
                    toast.success('Adoption request submitted successfully! 🐾');
                    form.reset();
                    navigate('/dashboard/my-requests');
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to submit request.');
            });
    };

    return (
        <div className="container mx-auto px-6 py-12 bg-blue-50 min-h-screen text-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 🐾 Left Section: Pet Info Details (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-blue-50 border  rounded-3xl overflow-hidden shadow-xl p-6 space-y-6">
                    <img src={pet.image} alt={pet.name} className="w-full h-[400px] object-cover rounded-2xl border " />
                    
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h2 className="text-4xl font-black text-blue-900 flex items-center gap-2">
                                {pet.name}
                                <span className={`text-xs px-3 py-1 rounded-full border ${pet.status === 'adopted' ? 'bg-blue-300 text-blue-900 border-blue-500/20' : 'bg-purple-800 text-white border-emerald-500/20'}`}>
                                    {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                                </span>
                            </h2>
                            <p className="text-gray-900 font-medium text-sm mt-1 flex items-center gap-1.5">
                                <MapPin size={16} className="text-emerald-900" /> {pet.location}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-cyan-800 uppercase font-bold tracking-wider">Adoption Fee</p>
                            <p className="text-3xl font-black text-red-500">${pet.adoptionFee}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/60">
                        <div className="bg-purple-800 p-4 rounded-xl border  text-center">
                            <p className="text-xl text-white font-bold">SPECIES</p>
                            <p className="text-base font-bold text-white mt-1">{pet.species}</p>
                        </div>
                        <div className="bg-sky-700 p-4 rounded-xl border text-center">
                            <p className="text-xl text-white font-bold">BREED</p>
                            <p className="text-base font-bold text-white mt-1">{pet.breed}</p>
                        </div>
                        <div className="bg-teal-800 p-4 rounded-xl border  text-center">
                            <p className="text-xl text-white font-bold">AGE</p>
                            <p className="text-base font-bold text-white mt-1">{pet.age}</p>
                        </div>
                        <div className="bg-blue-900 p-4 rounded-xl border  text-center">
                            <p className="text-xl text-white font-bold">GENDER</p>
                            <p className="text-base font-bold text-white mt-1">{pet.gender}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-indigo-200 p-4 rounded-xl border ">
                            <p className="text-xl text-slate-900 font-bold">HEALTH STATUS</p>
                            <p className="text-sm font-semibold text-purple-950 mt-1">{pet.healthStatus}</p>
                        </div>
                        <div className="bg-indigo-200 p-4 rounded-xl border ">
                            <p className="text-xl text-slate-900 font-bold">VACCINATION STATUS</p>
                            <p className="text-sm font-semibold text-purple-950 mt-1">{pet.vaccinationStatus}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-xl font-bold text-blue-900">Story & Description</h4>
                        <p className="text-sm text-purple-900 leading-relaxed bg-indigo-100 p-4 rounded-xl ">{pet.description}</p>
                    </div>
                </div>
                {info && (
  <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200 mt-6">
    <h3 className="text-purple-900 font-bold text-xl">
      {info.title}
    </h3>

    <p className="text-gray-900 mt-2">
      {info.description}
    </p>

    <ul className="mt-3 text-black list-disc pl-5">
      {info.tips.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>

    <p className="mt-3 text-purple-900">
      ⭐ {info.fact}
    </p>
  </div>
)}

                {/* 📋 Right Section: Adoption Request Side Panel Form */}
                <div className="border border-indigo-300 rounded-3xl p-6 shadow-xl h-fit sticky top-24">
                    <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-1">
                        <Heart className="text-purple-900 w-5 h-5 fill-purple-900" /> Adoption Request
                    </h3>
                    <p className="text-sm text-indigo-800 mb-6">Submit this application form to request adoption.</p>

                    {isOwner ? (
                        <div className=" border  text-red-400 p-4 rounded-xl text-xs flex gap-2 items-start leading-relaxed">
                            <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                            <span>You are the manager/owner of this pet listing. Adoption requests are disabled for owners.</span>
                        </div>
                    ) : pet.status === 'adopted' ? (
                        <div className="bg-blue-950/30 border border-blue-900/40 text-blue-400 p-4 rounded-xl text-xs flex gap-2 items-start leading-relaxed">
                            <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                            <span>This companion has been successfully adopted into another loving home. Applications closed.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleAdoptionSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-gray-900 font-semibold mb-1">Pet Name (Read Only)</label>
                                <input type="text" readOnly value={pet.name} className="w-full bg-indigo-200 hover:bg-indigo-800 p-3 rounded-xl text-purple-900 hover:text-white cursor-not-allowed font-medium focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-900 font-semibold mb-1">Your Name (Read Only)</label>
                                <input type="text" readOnly value={user?.displayName || "Anonymous User"} className="w-full bg-indigo-200 hover:bg-indigo-800  p-3 rounded-xl text-purple-900 hover:text-white cursor-not-allowed font-medium focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-900 font-semibold mb-1">Your Email (Read Only)</label>
                                <input type="email" readOnly value={user?.email || ""} className="w-full bg-indigo-200 hover:bg-indigo-800 p-3 rounded-xl text-purple-900 hover:text-white cursor-not-allowed font-medium focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-900 font-semibold mb-1">Target Pickup Date</label>
                                <div className="relative">
                                    <input type="date" name="pickupDate" required className="w-full bg-indigo-200 hover:bg-indigo-800 p-3 rounded-xl text-blue-800 hover:text-white font-medium focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-blue-900 text-sm font-semibold mb-1">Introduction Message</label>
                                <textarea name="message" rows="3" required className="w-full bg-indigo-200 p-3 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-emerald-500 resize-none" placeholder="Tell the shelter why you are a great match for this pet..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-purple-900 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-950/30">
                                Submit Application
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
