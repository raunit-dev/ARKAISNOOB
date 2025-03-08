import React from "react";
import { FaShieldAlt, FaCertificate, FaBrain, FaCube } from "react-icons/fa";
import { Link } from "react-router-dom";

const EduNFTLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-950 via-gray-900 to-purple-950 text-white flex flex-col items-center px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold leading-tight">
          Revolutionizing Education with{" "}
          <span className="text-violet-300">AI & Blockchain</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Verify, Showcase, and Own Your Achievements with EduNFT
        </p>

        <Link to="/auth">
            <button className="mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-violet-500/50 flex items-center mx-auto border border-violet-500 hover:border-white">
                Get Started <FaShieldAlt className="ml-2" />
            </button>
        </Link>
      </div>

      {/* Feature Sections */}
      <div className="mt-12 flex justify-center gap-10 max-w-6xl">
        <FeatureCard
          icon={<FaBrain />}
          title="AI-Powered Recommendation"
          desc="Verify academic records with AI-driven accuracy."
        />
        <FeatureCard
          icon={<FaCertificate />}
          title="NFT-Based Certifications"
          desc="Own your achievements as digital assets."
        />
        <FeatureCard
          icon={<FaShieldAlt />}
          title="Skill Analytics & Badges"
          desc="AI-driven skill gap analysis & badge suggestions."
        />
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-white/10 py-8 px-6 rounded-xl shadow-lg w-full max-w-3xl border border-gray-700">
        <p className="text-2xl font-semibold text-white">
          Start Verifying & Owning Your Achievements Today!
        </p>
        <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-purple-500/50 border border-purple-500 hover:border-white">
          Join EduNFT
        </button>
      </div>
    </div>
  );
};

// Feature Card Component (Updated)
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-gray-900 p-8 w-72 rounded-2xl shadow-lg border border-gray-700 
                  flex flex-col items-center text-center transition-all duration-300 
                  hover:scale-105 hover:shadow-violet-500/50">
    <div className="text-5xl text-violet-400 animate-pulse">{icon}</div>
    <h3 className="mt-4 text-2xl font-bold text-gray-100">{title}</h3>
    <p className="mt-2 text-gray-400">{desc}</p>
  </div>
);

export default EduNFTLanding;
