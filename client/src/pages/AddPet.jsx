import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';

const AddPet = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        const petData = {
            name: form.name.value,
            category: form.species.value, 
            breed: form.breed.value,
            age: form.age.value,
            gender: form.gender.value,
            image: form.image.value,
            healthStatus: form.healthStatus.value,
            vaccinationStatus: form.vaccinationStatus.value,
            location: form.location.value,
            adoptionFee: parseFloat(form.adoptionFee.value),
            description: form.description.value,
            ownerEmail: user?.email, 
            status: "available" 
        };

        axios.post(
            'https://pet-adoption-server-gamma.vercel.app/pets',
 petData, 
 { withCredentials: true }
)
            .then(res => {
                if (res.data.insertedId) {
                    toast.success('Pet listed successfully for adoption! 🐾');
                    form.reset();
                    navigate('/dashboard/my-listings'); 
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Something went wrong!');
            });
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-blue-50 min-h-screen">        
            <div className="max-w-4xl mx-auto bg-blue-50 border border-indigo-100 rounded-3xl p-8 shadow-2xl space-y-6">               
           
                <div className="border-b border-indigo-100 pb-5">
                    <h2 className="text-3xl font-black text-blue-900 flex items-center gap-2">
                        <PlusCircle className="text-purple-800" size={32} />
                        Add a New Pet Listing
                    </h2>
                    <p className="text-purple-900/70 font-medium text-sm mt-1">
                        Fill out the details below to list a companion for adoption.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">                  
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Pet Name</label>
                        <input type="text" name="name" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="e.g. Max" />
                    </div>                  
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Species</label>
                        <select name="species" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition cursor-pointer">
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Rabbit">Rabbit</option>
                        </select>
                    </div>            
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Breed</label>
                        <input type="text" name="breed" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="e.g. German Shepherd" />
                    </div>                    
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Age (Years/Months)</label>
                        <input type="text" name="age" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="e.g. 2 Years" />
                    </div>            
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Gender</label>
                        <select name="gender" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition cursor-pointer">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>                
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Image URL</label>
                        <input type="url" name="image" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="https://unsplash.com..." />
                    </div>                
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Health Status</label>
                        <input type="text" name="healthStatus" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="e.g. Excellent, Fully Fit" />
                    </div>                
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Vaccination Status</label>
                        <select name="vaccinationStatus" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition cursor-pointer">
                            <option value="Fully Vaccinated">Fully Vaccinated</option>
                            <option value="Partially Vaccinated">Partially Vaccinated</option>
                            <option value="Not Vaccinated">Not Vaccinated</option>
                        </select>
                    </div>                
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Location</label>
                        <input type="text" name="location" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="e.g. Gulshan, Dhaka" />
                    </div>            
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Adoption Fee ($)</label>
                        <input type="number" name="adoptionFee" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition placeholder-purple-900/40" placeholder="e.g. 50 (0 for free)" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Owner Email (Read Only)</label>
                        <input type="email" name="ownerEmail" readOnly value={user?.email || ""} className="w-full bg-indigo-200/50 text-purple-950/60 font-semibold p-3.5 rounded-xl border border-indigo-200/40 cursor-not-allowed focus:outline-none" />
                    </div>                
                    <div className="md:col-span-2">
                        <label className="block text-blue-900 font-bold mb-2">Description / Pet Story</label>
                        <textarea name="description" rows="4" required className="w-full bg-indigo-100/70 text-purple-900 font-semibold p-4 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 transition resize-none placeholder-purple-900/40" placeholder="Tell potential adopters about this pet's personality, habits, and needs..."></textarea>
                    </div>
  
                    <div className="md:col-span-2 pt-2">
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-purple-900 text-white font-black p-4 rounded-xl transition duration-300 shadow-xl shadow-emerald-950/20 active:scale-[0.98]">
                            Publish Pet Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPet;
