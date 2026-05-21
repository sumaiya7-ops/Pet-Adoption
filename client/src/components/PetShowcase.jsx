import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, X } from "lucide-react";

// কোয়ালার বদলে প্রজেক্ট ফিল্টারের সাথে মিলিয়ে Dog, Rabbit, Cat করা হলো
const pets = [
    {
        id: 1,
        title: "Lovely Puppies",
        year: "2026",
        image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=1200&auto=format&fit=crop",
        short: "Gentle and adorable golden puppies known for their playful personality and loyal nature.",
        full: "Puppies are energetic, quick learners, and grow strong deep emotional bonds with families..."
    },
    {
        id: 2,
        title: "Cute Bunnies",
        year: "2025",
        image:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1200&auto=format&fit=crop",

        short: "Soft, silent, and affectionate little companions perfect for quiet home environments.",
        full: "Bunnies are highly social, extremely quiet, clean, and love gentle physical contact..."
    },
    {
        id: 3,
        title: "Sweet Cats",
        year: "2024",
        image:  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop",
        short: "Independent yet deeply comforting companions with fluffy personalities.",
        full: "Cats are very intuitive animals that bring a peaceful vibration and calm aura to any living space..."
    }
];

const PetShowcase = () => {
    const [selectedPet, setSelectedPet] = useState(null);   
    const navigate = useNavigate();                         

    return (
        <section className="bg-blue-50/50 py-20 px-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Heading */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tight">
                        Meet Your Future <span className="text-purple-800">Best Friend</span> 🐾
                    </h2>
                    <p className="text-purple-900/60 font-semibold text-sm max-w-md mx-auto">
                        Explore stories of incredible companions waiting to share sweet moments with you.
                    </p>
                </div>

                {/* Cards Grid Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pets.map((pet) => (
                        <div key={pet.id} className="bg-white rounded-3xl shadow-md border border-indigo-100 overflow-hidden group hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                            <div className="relative h-64 overflow-hidden">
                                <img src={pet.image} className="h-full w-full object-cover group-hover:scale-105 transition duration-700 ease-out" alt={pet.title} />
                                <span className="absolute top-4 left-4 bg-purple-950 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-sm">
                                    Batch {pet.year}
                                </span>
                            </div>

                            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-blue-900 group-hover:text-purple-900 transition-colors">
                                        {pet.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {pet.short}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedPet(pet)}
                                    className="w-full mt-2 bg-indigo-50 hover:bg-purple-900 text-purple-900 hover:text-white font-black text-xs py-3 rounded-xl border border-indigo-100 hover:border-purple-950 flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
                                >
                                    Read Story <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔮 INTERACTIVE BLUR GLASS MODAL PANEL (ভাঙা ট্যাগ ফিক্সড) */}
            {selectedPet && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden animate-scale-up border border-indigo-50">
                        
                        <button
                            onClick={() => setSelectedPet(null)}
                            className="absolute top-4 right-4 bg-indigo-50 hover:bg-indigo-100 text-purple-900/60 hover:text-purple-900 p-1.5 rounded-full transition-colors z-10"
                        >
                            <X size={18} />
                        </button>

                        <img src={selectedPet.image} className="h-64 w-full object-cover" alt={selectedPet.title} />

                        <div className="p-8 space-y-5">
                            <div>
                                <span className="bg-indigo-50 text-purple-800 px-3 py-1 rounded-full text-xs font-black tracking-wide border border-indigo-100">
                                    Featured Companion
                                </span>
                                <h3 className="text-3xl font-black text-blue-900 tracking-tight mt-2.5">
                                    {selectedPet.title}
                                </h3>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed bg-indigo-50/30 p-4 rounded-xl border border-indigo-50 italic">
                                "{selectedPet.full}"
                            </p>

                            <button
                                onClick={() => {
                                    setSelectedPet(null);
                                    navigate("/all-pets");
                                }}
                                className="w-full bg-emerald-600 hover:bg-purple-900 text-white font-black py-3.5 rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-wider"
                            >
                                <Heart size={14} className="fill-white" /> View All Companions for Adoption
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
};

export default PetShowcase;
