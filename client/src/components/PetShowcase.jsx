import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, X } from "lucide-react";

const pets = [
    {
        id: 1,
        title: "Lovely Puppies",
        year: "2026",
        image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=1200&auto=format&fit=crop",
        short: "Gentle and adorable golden puppies known for their playful personality.",
        full: "Puppies are energetic, quick learners, and grow strong emotional bonds with families."
    },
    {
        id: 2,
        title: "Cute Bunnies",
        year: "2025",
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1200&auto=format&fit=crop",
        short: "Soft, silent, and affectionate little companions.",
        full: "Bunnies are highly social, extremely quiet, clean, and love gentle care."
    },
    {
        id: 3,
        title: "Sweet Cats",
        year: "2024",
        image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop",
        short: "Independent yet deeply comforting companions.",
        full: "Cats are intuitive animals that bring calm and peace to any home."
    },
    {
        id: 4,
        title: "Friendly Dogs",
        year: "2026",
        image: "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=1200&auto=format&fit=crop",
        short: "Loyal and protective family companions.",
        full: "Dogs are known for loyalty, intelligence, and emotional bonding with humans."
    },
    {
        id: 5,
        title: "Parrot Friends",
        year: "2025",
        image: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=1200&auto=format&fit=crop",
        short: "Colorful and intelligent talking birds.",
        full: "Parrots are highly intelligent birds that can mimic sounds and words."
    },
    {
        id: 6,
        title: "Fluffy Rabbits",
        year: "2024",
        image: "https://images.unsplash.com/photo-1552410260-0fd9b577afa6?q=80&w=1200&auto=format&fit=crop",
        short: "Cute and calm indoor pets.",
        full: "Rabbits are gentle animals that enjoy quiet environments and soft care."
    }
];

const PetShowcase = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const navigate = useNavigate();

    return (
        <section className="bg-blue-50/50 py-20 px-6">

            <div className="max-w-7xl mx-auto space-y-12">

                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-blue-900">
                        Meet Your Future <span className="text-purple-800">Best Friend</span> 🐾
                    </h2>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pets.map((pet) => (
                        <div key={pet.id} className="bg-white rounded-3xl shadow-md overflow-hidden border">

                            <img src={pet.image} className="h-64 w-full object-cover" alt={pet.title} />

                            <div className="p-6 space-y-3">
                                <h3 className="text-xl font-black text-blue-900">
                                    {pet.title}
                                </h3>

                                <p className="text-sm text-gray-600">
                                    {pet.short}
                                </p>

                                <button
                                    onClick={() => setSelectedPet(pet)}
                                    className="w-full bg-indigo-50 hover:bg-purple-900 hover:text-white text-purple-900 font-bold py-2 rounded-xl"
                                >
                                    Read Story <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {selectedPet && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 relative">

                        <button
                            onClick={() => setSelectedPet(null)}
                            className="absolute top-3 right-3"
                        >
                            <X />
                        </button>

                        <img src={selectedPet.image} className="rounded-xl mb-4" />

                        <h2 className="text-2xl font-black text-blue-900">
                            {selectedPet.title}
                        </h2>

                        <p className="mt-3 text-gray-700">
                            {selectedPet.full}
                        </p>

                        <button
                            onClick={() => {
                                setSelectedPet(null);
                                navigate("/all-pets");
                            }}
                            className="mt-5 w-full bg-emerald-600 text-white py-3 rounded-xl"
                        >
                            View All Pets
                        </button>

                    </div>
                </div>
            )}

        </section>
    );
};

export default PetShowcase;
