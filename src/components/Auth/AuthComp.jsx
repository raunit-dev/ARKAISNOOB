import React, { useEffect, useState } from "react";
import axios from "axios";
import { link } from "../../BaseLink";
const LoginSignup = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    wallet_address: "123456789876543215",
  });

  useEffect(() => {
    console.log("Active Form:", activeForm);
  }, [activeForm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "College" : "Student") : value,
    }));
  };

  const handleAuth = async () => {
    const url = activeForm === "signup" ? `${link}/auth/register` : `${link}/auth/login`;
    const payload =
      activeForm === "signup"
        ? { ...formData, secret: "RAUNITISTHEKING" }
        : { email: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response:", response.data);
      alert(`${activeForm} successful!`);
      if (response.data.user.roleModel === "College") {
        window.location.href = "/college";
      }
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-black to-purple-900 text-white">
      <h1 className="text-4xl font-bold mb-10">EduNFT - Secure Your Achievements</h1>

      {!activeForm ? (
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveForm("login")}
            className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
          >
            Login
          </button>
          <button
            onClick={() => setActiveForm("signup")}
            className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="w-3/4 h-[70vh] shadow-xl rounded-2xl overflow-hidden border-2 border-gray-700 flex">
          {activeForm === "login" && (
            <div className="w-full flex flex-col justify-center items-center p-10 bg-gray-900">
              <h2 className="text-3xl font-bold mb-6">Login</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-80 p-3 mb-3 bg-gray-800 rounded-lg border border-gray-700"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-80 p-3 mb-3 bg-gray-800 rounded-lg border border-gray-700"
              />
              <button
                onClick={handleAuth}
                className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
              >
                Login
              </button>
              <button
                onClick={() => setActiveForm(null)}
                className="mt-4 text-sm text-gray-400 hover:underline"
              >
                Back
              </button>
            </div>
          )}

          {activeForm === "signup" && (
            <div className="w-full flex flex-col justify-center items-center p-10 bg-gray-800">
              <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-80 p-3 mb-3 bg-gray-700 rounded-lg border border-gray-600"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-80 p-3 mb-3 bg-gray-700 rounded-lg border border-gray-600"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-80 p-3 mb-3 bg-gray-700 rounded-lg border border-gray-600"
              />
              <div className="flex flex-col items-start mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="role"
                    checked={formData.role === "College"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Sign Up as College
                </label>
              </div>
              <button
                onClick={handleAuth}
                className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
              >
                Sign Up
              </button>
              <button
                onClick={() => setActiveForm(null)}
                className="mt-4 text-sm text-gray-400 hover:underline"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
