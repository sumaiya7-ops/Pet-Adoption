import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ArrowRight, PawPrint, ArrowUpDown } from 'lucide-react';

const AllPets = () => {
    const [pets, setPets] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [sort, setSort] = useState(''); 

    const speciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit'];

    useEffect(() => {
        const speciesQuery = selectedSpecies.join(',');
        // 🔗 লাইভ সার্ভার লিংক এখানে যুক্ত করা হলো
        const baseUrl = 'https://pet-adoption-server-gamma.vercel.app';
        
        // ডাটাবেস ও কোডের সামঞ্জস্যের জন্য species প্যারামিটারটি পাঠানো হচ্ছে
        axios.get(`${baseUrl}/pets?search=${search}&species=${speciesQuery}&sort=${sort}`)
            .then(res => setPets(res.data))
            .catch(err => console.error("Error fetching pets:", err));
    }, [search, selectedSpecies, sort]); 

    const handleSpeciesChange = (species) => {
        if (selectedSpecies.includes(species)) {
            setSelectedSpecies(selectedSpecies.filter(s => s !== species));
        } else {
            setSelectedSpecies([...selectedSpecies, species]);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen bg-blue-50 text-slate-900 transition-all duration-300">
            
            {/* 🐾 Header Title with Soft Pulse Animation */}
            <div className="flex items-center gap-3 justify-center mb-10">
                <PawPrint className="text-purple-800 w-10 h-10 animate-bounce" />
                <h2 className="text-3xl md:text-5xl font-black text-center text-blue-900 tracking-tight">
                    Find Your New <span className="text-purple-800 relative inline-block after:absolute after:bottom-1 after:left-0 after:w-full after:h-1 after:bg-emerald-500 after:rounded">Best Friend</span>
                </h2>
            </div>
            
            {/* 🔍 Premium Search, Filter & Sort Layout */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12 bg-white p-6 rounded-3xl border border-indigo-100 shadow-xl items-center justify-between">
                
                {/* Live Name Search */}
                <div className="relative w-full lg:w-1/4">
                    <Search className="absolute left-4 top-3.5 text-purple-900/50 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search pets by name..." 
                        className="w-full bg-indigo-50/70 text-purple-900 font-semibold pl-12 pr-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition-all text-sm placeholder-purple-900/40"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {/* Species Filter Checkboxes */}
                <div className="flex flex-wrap items-center gap-6 bg-indigo-50/40 px-6 py-2.5 rounded-xl border border-indigo-100 w-full lg:w-auto">
                    <span className="text-sm font-bold text-blue-900 flex items-center gap-2">
                        <Filter size={16} className="text-purple-800" /> Filter by:
                    </span>
                    <div className="flex flex-wrap gap-4">
                        {speciesOptions.map(species => (
                            <label key={species} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold group text-purple-900 hover:text-purple-700 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={selectedSpecies.includes(species)}
                                    onChange={() => handleSpeciesChange(species)}
                                    className="w-4 h-4 rounded border-indigo-300 bg-white text-purple-800 focus:ring-purple-500 accent-purple-800 cursor-pointer"
                                />
                                <span className="group-hover:translate-x-0.5 transition-transform">{species}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Dynamic Sorting Dropdown */}
                <div className="relative w-full lg:w-1/5">
                    <div className="absolute left-4 top-3.5 text-purple-900/50 flex items-center pointer-events-none">
                        <ArrowUpDown size={16} className="text-purple-800" />
                    </div>
                    <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full bg-indigo-50/70 text-purple-900 font-bold pl-12 pr-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Sort by Price</option>
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* 🐾 Pets Dynamic Card Grid */}
            {pets.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-indigo-100 max-w-xl mx-auto shadow-lg animate-fade-in">
                    <p className="text-purple-900/60 text-base font-bold">No available pets match your criteria at this moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pets.map(pet => (
                        <div key={pet._id} className="bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 transform">
                            
                            {/* Card Image Wrapper with dynamic Zoom */}
                            <div className="relative h-56 overflow-hidden">
                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                <span className="absolute top-4 right-4 bg-purple-900/90 text-white font-black text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md">
                                    {pet.category || pet.species}
                                </span>
                            </div>

                            {/* Card Body content */}
                            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black text-blue-900 group-hover:text-purple-900 transition-colors duration-200">{pet.name}</h3>
                                        <span className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider ${pet.status === 'adopted' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-purple-800 text-white shadow-sm'}`}>
                                            {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-purple-950 font-bold pt-1">Breed: <span className="text-gray-600 font-semibold">{pet.breed}</span> | Age: <span className="text-gray-600 font-semibold">{pet.age}</span></p>
                                    <p className="text-sm text-purple-950 font-bold">Location: <span className="text-gray-600 font-semibold">{pet.location}</span></p>
                                </div>
                                <div className="pt-4 border-t border-indigo-50 flex justify-between items-center">
                                    <span className="text-xl font-black text-purple-950">${pet.price || pet.adoptionFee || 0}</span>
                                    <Link to={`/pet/${pet._id}`} className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-800 text-white font-black text-sm px-5 py-2.5 rounded-xl shadow-lg hover:from-purple-800 hover:to-blue-900 transition-all duration-300">
                                        View Details <ArrowRight size={16} />
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
