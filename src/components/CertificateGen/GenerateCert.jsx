import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { link } from "../../BaseLink";

const GenerateCertificate = () => {
  const { walletid } = useParams(); // Get wallet ID from URL
  const [walletAddress, setWalletAddress] = useState(walletid || ""); // Set wallet address if available
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [achievement, setAchievement] = useState(" ")
    console.log({studentAddress:walletid, achievement:achievement, issueDate:date })
  const handleGenerate = async () => {
    if (!walletAddress) {
      alert("Please enter a valid wallet address.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      const resp = await axios.post(
        `${link}/nft/mintportfolio`,
        { studentAddress:walletid, achievement:achievement, issueDate:date  },
        { headers }
      );
  
      console.log(resp.data);
      alert(`Certificate generated for wallet: ${walletAddress}`);
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-violet-600 mb-6">
          Generate Certificate
        </h1>

        {/* Wallet Address Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Wallet Address
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Enter your wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        {/* Achievement Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Achievement
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Enter your achievement..."
            rows="3"
            value={achievement}
            onChange={(e)=>setAchievement(e.target.value)}
          ></textarea>
        </div>

        {/* Date Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Generate Certificate Button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-all"
        >
          Generate Certificate
        </button>
      </div>
    </div>
  );
};

export default GenerateCertificate;
