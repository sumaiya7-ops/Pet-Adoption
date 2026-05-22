import { Link } from "react-router-dom";
import { HeartHandshake, Search, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-indigo-200">     
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">       
          <div className="space-y-6">     
            <div className="inline-flex items-center gap-2 bg-indigo-200 text-indigo-900 px-5 py-2 rounded-full font-bold text-sm shadow-sm hover:scale-105 transition duration-300 cursor-pointer">
              🐾 Trusted Pet Adoption Platform
            </div>            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-indigo-950 leading-tight">
              Find Your{" "}
              <span className="text-indigo-600 relative">
                Perfect
                <span className="absolute left-0 bottom-2 w-full h-3 bg-indigo-300/40 -z-10 rounded-lg animate-pulse"></span>
              </span>{" "}
              Furry Friend
            </h1>            
            <p className="text-lg text-indigo-800 leading-relaxed max-w-2xl hover:text-indigo-900 transition">
              Discover loving pets waiting for a forever home.
              Connect with trusted shelters through a modern adoption platform.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">

              <Link
                to="/all-pets"
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-110 hover:shadow-indigo-300/50 transition-all duration-300"
              >
                Explore Pets
              </Link>

              <Link
                to="/register"
                className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-900 px-8 py-4 rounded-2xl font-bold shadow-md hover:scale-110 transition-all duration-300"
              >
                Join Now
              </Link>

            </div>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-3 gap-4 mt-10">

              {/* Card 1 */}
              <div className="bg-white/70 backdrop-blur-md border border-indigo-100 rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <HeartHandshake className="text-pink-500 w-9 h-9 mb-3 group-hover:scale-110 transition" />
                <h3 className="font-black text-indigo-950 text-lg">Safe Adoption</h3>
                <p className="text-indigo-700 text-sm mt-1">
                  Trusted verified adoption system.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/70 backdrop-blur-md border border-indigo-100 rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <Search className="text-indigo-600 w-9 h-9 mb-3 group-hover:rotate-12 transition" />
                <h3 className="font-black text-indigo-950 text-lg">Smart Search</h3>
                <p className="text-indigo-700 text-sm mt-1">
                  Find pets instantly by filter.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/70 backdrop-blur-md border border-indigo-100 rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <ShieldCheck className="text-emerald-500 w-9 h-9 mb-3 group-hover:scale-110 transition" />
                <h3 className="font-black text-indigo-950 text-lg">Secure Platform</h3>
                <p className="text-indigo-700 text-sm mt-1">
                  Protected authentication system.
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative group">

            <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop"
              alt="Pet"
              className="w-full h-[650px] object-cover rounded-[40px] shadow-2xl border-4 border-white 
              transition-transform duration-500 group-hover:scale-105"
            />

            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-indigo-100
              hover:scale-110 transition duration-300 cursor-pointer">

              <h3 className="text-2xl font-black text-indigo-950">
                500+
              </h3>

              <p className="text-indigo-700 font-semibold">
                Pets Successfully Adopted
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;