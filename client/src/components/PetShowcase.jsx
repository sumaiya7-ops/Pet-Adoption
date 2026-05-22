import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";

const pets = [
    {
        id: 1,
        title: "Lovely Puppies",
        year: "2026",
        image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=1200&auto=format&fit=crop",
        short: "The ultimate old-school nerd name for your kitty.",
        full: "Throwback Nerd: Poindexter is the ultimate old-school nerd name. Perfect for a cat that looks like they are always plotting a science experiment or wearing invisible glasses."
    },
    {
        id: 2,
        title: "Cute Bunnies",
        year: "2025",
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1200&auto=format&fit=crop",
        short: "The perfect name for your brainy feline sidekick.",
           full: "Throwback Nerd: Sheldon is the perfect name for your brainy feline sidekick. This cat probably has a favorite spot on the couch that no one else is allowed to sit on!"
        
    },
    {
        id: 3,
        title: "Sweet Cats",
        year: "2024",
        image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop",
         short: "This name is so nerdy it's almost cool.",
        full: "Throwback Nerd: Milton is a name so nerdy it's almost cool. It suits a quiet, observant cat who just wants to hold onto his favorite red stapler."
    },
    {
        id: 4,
        title: "Friendly Dogs",
        year: "2026",
        image: "https://i.postimg.cc/3wmLFJcs/bam.jpg",
         short: "This video game-inspired name makes a great cat name.",
        full: "Tribute Nerd: Zelda is a video game-inspired name that makes a great cat name — especially if your kitty is 'legendary' and loves to go on grand adventures around the house."
    },
    {
        id: 5,
        title: "cat",
        year: "2025",
        image: "https://i.postimg.cc/Y0GLQjXQ/cat-cut.jpg",
        short: "Pay homage to one of the most influential scientists.",
        full: "Science Nerd: Newton pays homage to one of the most influential scientists of all time. Ideal for a smarty cat who constantly tests the laws of gravity by knocking things off the counter."
    },
    {
        id: 6,
        title: "panda",
        year: "2024",
        image: "https://i.postimg.cc/TwPDYtgt/panda.jpg",
       short: "A very fitting name for a philosophical feline.",
        full: "Science Nerd: Plato is a very fitting name for a philosophical feline. This cat spends hours staring blankly at the wall, deeply contemplating the universe and the meaning of life."
    }
];

const PetShowcase = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const navigate = useNavigate();

    
    return (
        <section className="bg-gradient-to-b from-blue-50/30 to-purple-50/20 py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tight">
                        Meet Your Future <span className="text-purple-800 relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-purple-300 after:bottom-1 after:left-0 after:-z-10">Best Friend</span> 🐾
                    </h2>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pets.map((pet) => (
                        <div 
                            key={pet.id} 
                            className="group bg-white rounded-3xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-500 ease-out border border-gray-100/50"
                        >
                            <div>
                                {/* IMAGE BOX WITH ZOOM HOVER */}
                                <div className="overflow-hidden h-64 w-full relative">
                                    <img 
                                        src={pet.image} 
                                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                                        alt={pet.title} 
                                    />
                                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-purple-900 shadow-sm">
                                        {pet.year}
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-3">
                                    <h3 className="text-xl font-black text-blue-900 capitalize group-hover:text-purple-900 transition-colors duration-300">
                                        {pet.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {pet.short}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6">
                                <button
                                    onClick={() => setSelectedPet(pet)}
                                    className="w-full bg-indigo-50/80 hover:bg-purple-900 hover:text-white text-purple-900 font-bold py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform active:scale-95"
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {selectedPet && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fadeIn">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 transition-transform duration-300">
                        <button
                            onClick={() => setSelectedPet(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 hover:rotate-90 transition-all duration-300"
                        >
                            <X size={24} />
                        </button>

                        <img src={selectedPet.image} className="rounded-xl mb-5 w-full h-64 object-cover shadow-sm" alt={selectedPet.title} />

                        <h2 className="text-2xl font-black text-blue-900 mb-2 capitalize">
                            {selectedPet.title}
                        </h2>

                        <p className="text-gray-700 leading-relaxed text-justify text-base">
                            {selectedPet.full}
                        </p>

                        <button
                            onClick={() => {
                                setSelectedPet(null);
                                navigate("/all-pets");
                            }}
                            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-600/30 transform active:scale-95"
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