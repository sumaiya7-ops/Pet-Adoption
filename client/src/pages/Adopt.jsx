import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ArrowLeft, Heart } from 'lucide-react';

const Adopt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pet = location.state;

    if (!pet) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center text-purple-900 font-bold text-lg">
                No pet selected 🐾
            </div>
        );
    }

    const handleConfirmAdoption = () => {      
        toast.success(`🎉 Congratulations! Your adoption request for ${pet.title || pet.name} has been sent successfully. 🐾`, {
            position: "top-center",
            autoClose: 4000,
            theme: "colored"
        });
        navigate("/dashboard/my-requests");
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6 py-12 transition-all duration-300">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden border border-indigo-50">
                <img src={pet.image} className="w-full h-72 object-cover" alt={pet.title} />

                <div className="p-8 space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-blue-900 tracking-tight flex items-center gap-2">
                            Adopt {pet.title || pet.name}
                        </h1>
                        <p className="text-purple-900/60 font-semibold text-sm mt-1">Ready to find a forever loving home.</p>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed bg-indigo-50/40 p-4 rounded-2xl border border-indigo-50/50 italic">
                        {pet.full || pet.description || "Every animal deserves a home filled with love and warmth. By confirming, you are opening your heart to a new companion."}
                    </p>

                    <div className="space-y-3 pt-2">                       
                        <button
                            onClick={handleConfirmAdoption}
                            className="w-full bg-emerald-600 hover:bg-purple-900 text-white font-black py-4 rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <Heart size={16} className="fill-white" /> Confirm Adoption
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-purple-900 font-black py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adopt;
