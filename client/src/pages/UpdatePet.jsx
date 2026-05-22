import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Edit3 } from 'lucide-react';

const UpdatePet = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);

    const baseUrl = import.meta.env.VITE_API_URL || 'https://vercel.app';

    // ১. ডাটাবেজ থেকে এই পেটের আগের তথ্য লোড করা
    useEffect(() => {
        axios.get(`${baseUrl}/pets/${id}`)
            .then(res => setPet(res.data))
            .catch(err => console.error(err));
    }, [id, baseUrl]);

    const handleUpdate = (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedData = {
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
        };

        // ২. ব্যাকএন্ডের PUT এপিআই কল করা (এটি আপনার index.js এ অলরেডি তৈরি করা আছে)
        axios.put(`${baseUrl}/pets/${id}`, updatedData, { withCredentials: true })
            .then(res => {
                if (res.data.modifiedCount > 0 || res.status === 200) {
                    toast.success('Pet information updated successfully! 🐾');
                    navigate('/dashboard/my-listings');
                } else {
                    toast.info('No changes were made.');
                    navigate('/dashboard/my-listings');
                }
            })
            .catch(() => toast.error('Failed to update pet listing.'));
    };

    if (!pet) return <div className="text-center py-20 text-purple-900 font-bold">Loading pet details...</div>;

    return (
        <div className="container mx-auto px-4 py-8 bg-blue-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white border border-indigo-100 rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="border-b border-indigo-100 pb-5">
                    <h2 className="text-3xl font-black text-blue-900 flex items-center gap-2">
                        <Edit3 className="text-amber-500" size={32} /> Update Pet Details
                    </h2>
                    <p className="text-purple-900/70 font-medium text-sm mt-1">Modify the specifications of your listed companion.</p>
                </div>

                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Pet Name</label>
                        <input type="text" name="name" defaultValue={pet.name} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Species</label>
                        <select name="species" defaultValue={pet.category} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800">
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Rabbit">Rabbit</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Breed</label>
                        <input type="text" name="breed" defaultValue={pet.breed} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Age</label>
                        <input type="text" name="age" defaultValue={pet.age} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Gender</label>
                        <select name="gender" defaultValue={pet.gender} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Image URL</label>
                        <input type="url" name="image" defaultValue={pet.image} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Health Status</label>
                        <input type="text" name="healthStatus" defaultValue={pet.healthStatus} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Vaccination Status</label>
                        <select name="vaccinationStatus" defaultValue={pet.vaccinationStatus} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800">
                            <option value="Fully Vaccinated">Fully Vaccinated</option>
                            <option value="Partially Vaccinated">Partially Vaccinated</option>
                            <option value="Not Vaccinated">Not Vaccinated</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Location</label>
                        <input type="text" name="location" defaultValue={pet.location} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div>
                        <label className="block text-blue-900 font-bold mb-2">Adoption Fee ($)</label>
                        <input type="number" name="adoptionFee" defaultValue={pet.adoptionFee} required className="w-full bg-indigo-100/50 p-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-blue-900 font-bold mb-2">Description / Pet Story</label>
                        <textarea name="description" rows="4" defaultValue={pet.description} required className="w-full bg-indigo-100/50 p-4 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 resize-none"></textarea>
                    </div>
                    <div className="md:col-span-2 pt-2">
                        <button type="submit" className="w-full bg-amber-500 hover:bg-purple-900 text-white font-black p-4 rounded-xl transition duration-300 active:scale-[0.98]">
                            Save Changes & Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePet;
