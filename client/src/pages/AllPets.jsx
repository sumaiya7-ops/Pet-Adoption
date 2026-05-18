import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ArrowRight, PawPrint } from 'lucide-react';

const AllPets = () => {
    const [pets, setPets] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState([]);

    const speciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit'];

    // সার্চ এবং ফিল্টার চেঞ্জের সাথে সাথে ডাটাবেজ থেকে রিয়েল-টাইম ডাটা ফেচ করা
    useEffect(() => {
        const speciesQuery = selectedSpecies.join(',');
        axios.get(`http://localhost:5000/pets?search=${search}&species=${speciesQuery}`)
            .then(res => setPets(res.data))
            .catch(err => console.error("Error fetching pets:", err));
    }, [search, selectedSpecies]);

    // চেক বক্স হ্যান্ডেল করার লজিক
    const handleSpeciesChange = (species) => {
        if (selectedSpecies.includes(species)) {
            setSelectedSpecies(selectedSpecies.filter(s => s !== species));
        } else {
            setSelectedSpecies([...selectedSpecies, species]);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen bg-slate-955 text-slate-100">
            {/* Header Title */}
            <div className="flex items-center gap-3 justify-center mb-10">
                <PawPrint className="text-emerald-500 w-8 h-8 animate-pulse" />
                <h2 className="text-3xl md:text-5xl font-black text-center text-white tracking-tight">
                    Find Your New <span className="text-emerald-500">Best Friend</span>
                </h2>
            </div>
            
            {/* 🔍 Advanced Search & Filter Layout */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl items-center justify-between">
                {/* Live Name Search */}
                <div className="relative w-full lg:w-1/3">
                    <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search pets by name..." 
                        className="w-full bg-slate-800 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {/* Species Filter Checkboxes */}
                <div className="flex flex-wrap items-center gap-6 bg-slate-950/40 px-6 py-2.5 rounded-xl border border-slate-800/60 w-full lg:w-auto">
                    <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                        <Filter size={16} className="text-emerald-500" /> Filter by:
                    </span>
                    <div className="flex flex-wrap gap-4">
                        {speciesOptions.map(species => (
                            <label key={species} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium group text-slate-300 hover:text-white transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={selectedSpecies.includes(species)}
                                    onChange={() => handleSpeciesChange(species)}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                />
                                <span>{species}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🐾 Pets Dynamic Card Grid */}
            {pets.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-900/60 max-w-xl mx-auto">
                    <p className="text-slate-500 text-base font-medium">No available pets match your criteria at this moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pets.map(pet => (
                        <div key={pet._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all duration-300">
                            <div className="relative h-56 overflow-hidden">
                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className="absolute top-4 right-4 bg-slate-950/80 text-emerald-400 font-black text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-700">
                                    {pet.species}
                                </span>
                            </div>
                            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black text-white">{pet.name}</h3>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${pet.status === 'adopted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                            {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">Breed: {pet.breed} | Age: {pet.age}</p>
                                    <p className="text-sm text-slate-400 font-medium">Location: {pet.location}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Adoption Fee</p>
                                        <p className="text-xl font-black text-emerald-400">${pet.adoptionFee}</p>
                                    </div>
                                    <Link to={`/pets/${pet._id}`} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs py-3 px-5 rounded-xl transition-all border border-slate-700 hover:border-emerald-500 group/btn">
                                        View Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllPets;
