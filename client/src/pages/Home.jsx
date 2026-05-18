import { Link } from 'react-router-dom';
import { Heart, Star, ShieldCheck, Calendar, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    // Featured Pets এর জন্য ৬টি ডেমো ডাটা (রিকোয়ারমেন্ট অনুযায়ী)
    const featuredPets = [
        { id: 1, name: "Buddy", species: "Dog", age: "2 Years", img: "https://unsplash.com" },
        { id: 2, name: "Luna", species: "Cat", age: "1 Year", img: "https://unsplash.com" },
        { id: 3, name: "Charlie", species: "Dog", age: "3 Years", img: "https://unsplash.com" },
        { id: 4, name: "Milo", species: "Rabbit", age: "6 Months", img: "https://unsplash.com" },
        { id: 5, name: "Bella", species: "Cat", age: "2 Years", img: "https://unsplash.com" },
        { id: 6, name: "Coco", species: "Bird", age: "5 Months", img: "https://unsplash.com" },
    ];

    return (
        <div className="space-y-24 pb-20 bg-slate-950">
            {/* 1. Hero Banner Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://unsplash.com')] bg-cover bg-center opacity-10 pointer-events-none"></div>
                <div className="max-w-4xl text-center z-10 space-y-6">
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider border border-emerald-500/20">
                        Meet Your New Family Member
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                        Don't Shop, <span className="text-emerald-500">Adopt</span> a Loving Soul
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Every pet deserves a second chance. Browse thousands of rescue animals waiting for a warm home and a lifetime of happiness.
                    </p>
                    <div className="pt-4">
                        <Link to="/all-pets" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 group">
                            Adopt Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Featured Pets Section (Minimum 6 Pets) */}
            <section className="container mx-auto px-6">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white">Featured Companions</h2>
                    <p className="text-slate-400 mt-2">Meet some of our adorable pets looking for a loving home right now.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredPets.map(pet => (
                        <div key={pet.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group hover:border-slate-700 transition-all duration-300">
                            <div className="relative h-64 overflow-hidden">
                                <img src={pet.img} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className="absolute top-4 right-4 bg-slate-950/80 text-emerald-400 font-bold text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-slate-700">
                                    {pet.species}
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-white">{pet.name}</h3>
                                    <span className="text-sm text-slate-400">Age: {pet.age}</span>
                                </div>
                                <Link to={`/pets/${pet.id}`} className="block w-full text-center bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-semibold py-3 rounded-xl transition-all border border-slate-700 hover:border-emerald-500">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Why Adopt Pets Section (Static 1) */}
            <section className="bg-slate-900/50 py-16 border-y border-slate-900">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <h2 className="text-3xl font-black text-white">Why Adopt a Pet?</h2>
                        <p className="text-slate-400 mt-2">Adopting is not just saving an animal; it changes your life forever.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20"><Heart size={24}/></div>
                            <h3 className="text-xl font-bold text-white">Save a Precious Life</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Shelters are overcrowded. Adopting gives an innocent animal a second chance at life and frees up space to save another.</p>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20"><ShieldCheck size={24}/></div>
                            <h3 className="text-xl font-bold text-white">Health and Vaccinated</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Most rescue pets are already examined, vaccinated, and spayed/neutered by shelters, saving you initial veterinary expenses.</p>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20"><Star size={24}/></div>
                            <h3 className="text-xl font-bold text-white">Unconditional Love</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Rescue animals seem to know they've been given a new lease on life, creating an unshakeable bond of affection and gratitude.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Success Stories Section (Static 2) */}
            <section className="container mx-auto px-6">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <h2 className="text-3xl font-black text-white">Happy Tails & Success Stories</h2>
                    <p className="text-slate-400 mt-2">Real stories from wonderful families who found their perfect match through us.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 items-center">
                        <img src="https://unsplash.com" alt="Success 1" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500" />
                        <div className="space-y-2">
                            <p className="text-sm text-slate-300 italic">"Adopting Max was the best decision our family made. He brought immense energy, laughter, and joy back into our quiet home."</p>
                            <h4 className="text-white font-bold text-base">— The Rahman Family with Max</h4>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 items-center">
                        <img src="https://unsplash.com" alt="Success 2" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500" />
                        <div className="space-y-2">
                            <p className="text-sm text-slate-300 italic">"Luna was shy at first, but with patience, she has become the most affectionate cat. Thank you PetAdopt for making this happen!"</p>
                            <h4 className="text-white font-bold text-base">— Sarah Ahmed with Luna</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Pet Care Tips Section (Static 3) */}
            <section className="bg-slate-900/50 py-16 border-y border-slate-900">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <h2 className="text-3xl font-black text-white">Essential Pet Care Tips</h2>
                        <p className="text-slate-400 mt-2">New to pet parenting? Keep these simple guidelines in mind for a healthy pet.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-emerald-400">01. Balanced Nutrition</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Always feed high-quality food appropriate for your pet's age, size, and specific breed requirements. Avoid feeding table scraps.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-emerald-400">02. Regular Exercise</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Dogs require daily walks and playtime, while cats thrive on interactive toys to maintain health and prevent behavioral issues.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-emerald-400">03. Vet Checkups</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Schedule routine annual examinations and keep up with necessary core vaccinations, flea control, and parasite prevention schedules.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Upcoming Adoption Events (Creative Extra Section 1) */}
            <section className="container mx-auto px-6">
                <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-8 md:p-12 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <Calendar size={16} /> Live Event
                        </div>
                        <h2 className="text-3xl font-black text-white">Weekend Adoption Gala</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">Come meet our rescue animals face-to-face this Saturday at Dhaka City Central Park from 10:00 AM to 5:00 PM. On-the-spot adoptions and free vet advice available!</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg whitespace-nowrap">
                        Get Event Details
                    </button>
                </div>
            </section>

            {/* 7. Volunteer Opportunities (Creative Extra Section 2) */}
            <section className="container mx-auto px-6 text-center max-w-3xl space-y-6">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Users size={24} />
                </div>
                <h2 className="text-3xl font-black text-white">Become a Shelter Volunteer</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
                    Not ready to adopt but still want to help? Join our fantastic network of passionate volunteers. Lend a hand in feeding, walking, or managing adoption desks.
                </p>
                <button className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-2 text-sm">
                    Apply for Volunteering <ArrowRight size={16} />
                </button>
            </section>
        </div>
    );
};

export default Home;
