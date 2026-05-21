import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900 border-t border-indigo-100 mt-20 overflow-hidden">

            {/* Glow background */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-300 blur-3xl opacity-30 rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-300 blur-3xl opacity-20 rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">

                {/* Brand */}
                <div>
                    <h2 className="text-3xl font-black tracking-tight">
                        Pet<span className="text-indigo-700">Adopt</span>
                    </h2>

                    <p className="text-sm mt-3 text-indigo-700 leading-relaxed">
                        A modern pet adoption platform connecting loving homes with rescued pets.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-6">

                        <a href="#"
                            className="p-3 bg-white hover:bg-blue-600 hover:text-white rounded-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300">
                            <FaFacebookF />
                        </a>

                        <a href="#"
                            className="p-3 bg-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 hover:text-white rounded-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300">
                            <FaInstagram />
                        </a>

                        <a href="https://github.com/sumaiya7-ops"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-xl shadow-md hover:bg-black hover:text-white hover:shadow-xl hover:scale-110 transition-all duration-300">
                            <FaGithub />
                        </a>

                        <a href="https://www.linkedin.com/in/sumaiya-sorhad"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-xl shadow-md hover:bg-blue-900 hover:text-white hover:shadow-xl hover:scale-110 transition-all duration-300 text-indigo-700">
                            <FaLinkedinIn />
                        </a>

                    </div>
                </div>

                {/* Links */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-indigo-700 transition" to="/">Home</Link></li>
                        <li><Link className="hover:text-indigo-700 transition" to="/all-pets">All Pets</Link></li>
                        <li><Link className="hover:text-indigo-700 transition" to="/dashboard/my-requests">My Requests</Link></li>
                        <li><Link className="hover:text-indigo-700 transition" to="/dashboard/my-listings">My Listings</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Contact</h3>

                    <p className="text-sm text-indigo-700">Chattogram, Bangladesh</p>
                    <p className="text-sm text-indigo-700 mt-2">Email: sumaiyakookie3072@gmail.com</p>
                    <p className="text-sm text-indigo-700 mt-2">Phone: 01826459605</p>

                    <div className="mt-4 text-sm text-indigo-600 font-semibold hover:underline cursor-pointer">
                        Available for collaboration 💙
                    </div>
                </div>

            </div>

            {/* Bottom */}
            <div className="border-t border-indigo-100 text-center py-4 text-xs text-indigo-500">
                © {new Date().getFullYear()} PetAdopt. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;