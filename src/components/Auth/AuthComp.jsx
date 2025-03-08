import React, { useEffect, useState } from "react";

const LoginSignup = () => {
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    console.log(activeForm);
},[activeForm]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-black to-purple-900 text-white">
      <h1 className="text-4xl font-bold mb-10">EduNFT - Secure Your Achievements</h1>
      
      {!activeForm ? (
        <div className="flex space-x-6">
          <button onClick={() => setActiveForm("login")} className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700">Login</button>
          <button onClick={() => setActiveForm("signup")} className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700">Sign Up</button>
        </div>
      ) : (
        <div className="w-3/4 h-[70vh] shadow-xl rounded-2xl overflow-hidden border-2 border-gray-700 flex">
          {activeForm === "login" && (
            <div className="w-full flex flex-col justify-center items-center p-10 bg-gray-900">
              <h2 className="text-3xl font-bold mb-6">Login</h2>
              <input type="email" placeholder="Email" className="w-80 p-3 mb-3 bg-gray-800 rounded-lg border border-gray-700" />
              <input type="password" placeholder="Password" className="w-80 p-3 mb-3 bg-gray-800 rounded-lg border border-gray-700" />
              <div className="flex flex-col items-start mb-4">
                <div className="flex items-center mb-2">
                  <input type="checkbox" id="loginStudent" className="mr-2" /> Login as College
                </div>
              </div>
              <button className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700">Login</button>
              <button onClick={() => setActiveForm(null)} className="mt-4 text-sm text-gray-400 hover:underline">Back</button>
            </div>
          )}
          
          {activeForm === "signup" && (
            <div className="w-full flex flex-col justify-center items-center p-10 bg-gray-800">
              <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
              <input type="text" placeholder="Name" className="w-80 p-3 mb-3 bg-gray-700 rounded-lg border border-gray-600" />
              <input type="email" placeholder="Email" className="w-80 p-3 mb-3 bg-gray-700 rounded-lg border border-gray-600" />
              <input type="password" placeholder="Password" className="w-80 p-3 mb-3 bg-gray-700 rounded-lg border border-gray-600" />
              <div className="flex flex-col items-start mb-4">
                <label className="flex items-center mb-2">
                  <input type="checkbox" id="signupStudent" className="mr-2" /> Sign Up as Student
                </label>
                <label className="flex items-center">
                  <input type="checkbox" id="signupCollege" className="mr-2" /> Sign Up as College
                </label>
              </div>
              <button className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700">Sign Up</button>
              <button onClick={() => setActiveForm(null)} className="mt-4 text-sm text-gray-400 hover:underline">Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
