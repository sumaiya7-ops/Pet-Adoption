import Hero from "../components/Hero";
import PetShowcase from "../components/PetShowcase";
const Home = () => {
  return (
    <div className="min-h-screen bg-indigo-100 text-indigo-900">
      <Hero />
      <PetShowcase />
    </div>
  );
};

export default Home;