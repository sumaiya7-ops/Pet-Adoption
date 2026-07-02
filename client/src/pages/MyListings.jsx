import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

const MyListings = () => {
  const { user } = useContext(AuthContext);

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://pet-adoption-server-gamma.vercel.app";

  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    available: 0,
    adopted: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [requests, setRequests] = useState([]);

  // LOAD LISTINGS
const loadListings = async () => {
  if (!user?.email) return;

  try {
    const res = await axios.get(
      `${baseUrl}/my-listings`,
      { withCredentials: true }
    );

    setPets(res.data.listings);
    setStats(res.data.stats);

  } catch (err) {
    toast.error("Failed to load listings");
  } finally {
    setLoading(false);
  }
};
  // DELETE PET
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this pet?");
    if (!ok) return;

    try {
      const res = await axios.delete(`${baseUrl}/pets/${id}`, {
        withCredentials: true,
      });

      if (res.data.deletedCount > 0) {
        toast.success("Pet deleted");
        loadListings();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

const fetchRequests = async (pet) => {
     if (!pet?._id) return;  


  setSelectedPet(pet);   // 🟢 আগে state set
  setShowModal(true);

  const res = await axios.get(
    `${baseUrl}/pet-requests/${pet._id}`,
    { withCredentials: true }
  );
 
  setRequests(res.data);
};
useEffect(() => {
  if (user?.email) {
    loadListings();
  }
}, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-3xl font-black">My Listings</h2>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          Total: {stats.totalListings}
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          Available: {stats.available}
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          Adopted: {stats.adopted}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Pet</th>
              <th className="p-3 text-left">Species</th>
              <th className="p-3 text-left">Breed</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id} className="border-t">

                <td className="p-3 flex gap-2 items-center">
                  <img src={pet.image} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold">{pet.name}</p>
                    <p className="text-xs">{pet.location}</p>
                  </div>
                </td>

                <td className="p-3">{pet.species}</td>
                <td className="p-3">{pet.breed}</td>

                <td className="p-3">
                  <span className="px-2 py-1 text-xs bg-green-100 rounded">
                    {pet.status}
                  </span>
                </td>

                <td className="p-3 text-right space-x-2">

                  <button className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                    View
                  </button>

                  <button
                    onClick={() => fetchRequests(pet)}
                    className="bg-purple-600 text-white px-2 py-1 text-xs rounded"
                  >
                    Requests
                  </button>

                  <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL (FIXED POSITION) */}
      {showModal && selectedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[600px] p-5 rounded-xl">

            <div className="flex justify-between border-b pb-2">
              <h2 className="font-bold">
                Requests for {selectedPet.name}
              </h2>

              <button onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2">

              {requests.length === 0 ? (
                <p>No requests</p>
              ) : (
                requests.map((req) => (
                  <div
                    key={req._id}
                    className="border p-2 rounded flex justify-between"
                  >
                    <div>
                      <p className="font-bold">{req.userEmail}</p>
                      <p className="text-xs">{req.pickupDate}</p>
                      <span className="text-xs">
                        {req.status}
                      </span>
                    </div>

                    <div className="space-x-2">

                      {req.status !== "Approved" && (
                        <button
                 onClick={async () => {
  try {
    await axios.patch(
      `${baseUrl}/requests/approve/${req._id}`,
      { petId: selectedPet?._id },
      { withCredentials: true }
    );

    toast.success("Approved");
    fetchRequests(selectedPet);
    loadListings();

  } catch (err) {
    toast.error("Approve failed");
  }
}}
                          className="bg-green-600 text-white px-2 py-1 text-xs"
                        >
                          Approve
                        </button>
                      )}

                      {req.status !== "Rejected" && (
                        <button
                          onClick={async () => {
                            await axios.patch(
                              `${baseUrl}/requests/reject/${req._id}`,
                              {},
                              { withCredentials: true }
                            );
                            toast.success("Rejected");
                            fetchRequests(selectedPet);
                          }}
                          className="bg-red-600 text-white px-2 py-1 text-xs"
                        >
                          Reject
                        </button>
                      )}

                    </div>

                  </div>
                ))
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyListings;