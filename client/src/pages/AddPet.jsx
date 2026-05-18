import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddPet = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        // ফর্ম থেকে সব ডেটা অবজেক্ট আকারে নেওয়া
        const petData = {
            name: form.name.value,
            species: form.species.value,
            breed: form.breed.value,
            age: form.age.value,
            gender: form.gender.value,
            image: form.image.value,
            healthStatus: form.healthStatus.value,
            vaccinationStatus: form.vaccinationStatus.value,
            location: form.location.value,
            adoptionFee: parseFloat(form.adoptionFee.value),
            description: form.description.value,
            ownerEmail: user?.email, // অটো-ফিল্ড ডাটা
            status: "available" // ডিফল্ট স্ট্যাটাস
        };

        // ব্যাকএন্ড এপিআই-তে ডেটা পাঠানো (With Credentials JWT এর জন্য)
        axios.post('http://localhost:5000/pets', petData, { withCredentials: true })
            .then(res => {
                if (res.data.insertedId) {
                    toast.success('Pet listed successfully for adoption! 🐾');
                    form.reset();
                    navigate('/dashboard/my-listings'); // রিডাইরেক্ট টু মাই লিস্টিংস
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Something went wrong!');
            });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-black text-white mb-2">Add a New Pet Listing</h2>
            <p className="text-slate-400 text-sm mb-8">Fill out the details below to list a pet for adoption.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200">
                {/* Pet Name */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Pet Name</label>
                    <input type="text" name="name" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="e.g. Max" />
                </div>

                {/* Species Dropdown */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Species</label>
                    <select name="species" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white">
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                    </select>
                </div>

                {/* Breed */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Breed</label>
                    <input type="text" name="breed" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="e.g. German Shepherd" />
                </div>

                {/* Age */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Age (Years/Months)</label>
                    <input type="text" name="age" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="e.g. 2 Years" />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Gender</label>
                    <select name="gender" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Image URL</label>
                    <input type="url" name="image" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="https://imgbb.com" />
                </div>

                {/* Health Status */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Health Status</label>
                    <input type="text" name="healthStatus" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="e.g. Excellent, Fully Fit" />
                </div>

                {/* Vaccination Status */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Vaccination Status</label>
                    <select name="vaccinationStatus" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white">
                        <option value="Fully Vaccinated">Fully Vaccinated</option>
                        <option value="Partially Vaccinated">Partially Vaccinated</option>
                        <option value="Not Vaccinated">Not Vaccinated</option>
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Location</label>
                    <input type="text" name="location" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="e.g. Gulshan, Dhaka" />
                </div>

                {/* Adoption Fee */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Adoption Fee ($)</label>
                    <input type="number" name="adoptionFee" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white" placeholder="e.g. 50 (0 for free)" />
                </div>

                {/* Owner Email (Read Only - Requirement) */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-slate-500">Owner Email (Read Only)</label>
                    <input type="email" name="ownerEmail" readOnly value={user?.email || ""} className="w-full bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-slate-500 cursor-not-allowed focus:outline-none" />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Description / Pet Story</label>
                    <textarea name="description" rows="4" required className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 text-white resize-none" placeholder="Tell potential adopters about this pet's personality, habits, and needs..."></textarea>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 pt-2">
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-4 rounded-xl transition duration-200 shadow-lg shadow-emerald-950/30">
                        Publish Pet Listing
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPet;
