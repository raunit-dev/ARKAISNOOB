import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { FaBook, FaChartBar, FaProjectDiagram, FaUser, FaBrain, FaCertificate } from "react-icons/fa";
import { link } from "../../BaseLink";
import Markdown from 'react-markdown'

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded_id = jwtDecode(token).userId;
    console.log(decoded_id);
    
    const fetchDetails = async () => {
      try {
        const resp = await axios.post(`${link}/getstudentdetails`, { s_email: decoded_id });
        console.log(resp.data.user);
        setStudentData(resp.data.user);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    const fetchAnalysis = async () => {
      try {
        const resp = await axios.get(`${link}/analyze`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(resp.data);
        setAnalysisData(resp.data);
      } catch (error) {
        console.error("Error fetching AI analysis:", error);
      }
    };

    fetchDetails();
    fetchAnalysis();
  }, []);

  if (!studentData) {
    return <div className="text-center text-xl font-bold mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-300 text-gray-900 flex flex-col items-center px-6 py-12">
      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-lg border border-gray-300">
        {/* Student Info */}
        <div className="flex items-center space-x-4 border-b pb-4 border-gray-300">
          <FaUser className="text-4xl text-violet-500" />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">{studentData.name}</h2>
            <p className="text-lg text-gray-600 mt-1">{studentData.email}</p>
            <p className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-md inline-block mt-2">
              Wallet: <span className="font-mono text-gray-800">{studentData.wallet_address}</span>
            </p>
          </div>
        </div>

        {/* Certificates */}
        <Section title="Certificates" icon={<FaCertificate />}>
          {studentData.role.certificates && studentData.role.certificates.length > 0 ? (
            studentData.role.certificates.map((certificate) => (
              <div key={certificate.token_id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <p className="text-gray-700">Token ID: <span className="font-bold">{certificate.token_id}</span></p>
                <p className="text-gray-700">Achievement: <span className="font-bold">{certificate.achievement}</span></p>
                <p className="text-gray-700">Issued On: {new Date(certificate.issue_date).toLocaleDateString()}</p>
                <a
                  href="https://edu-chain-testnet.blockscout.com/address/0x3fcC09B2D1023b031FB45317c170C0AB6eFDdaC0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-500 underline"
                >
                  View Certificate
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No certificates available.</p>
          )}
        </Section>

        {/* AI Analysis */}
        <Section title="AI Analysis" icon={<FaBrain />}>
          {analysisData ? (
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">

              <p className="text-gray-700"> <Markdown>{analysisData.message}</Markdown></p>
            </div>
          ) : (
            <p className="text-gray-500">AI analysis is currently unavailable.</p>
          )}
        </Section>

        {/* Other Sections */}
        <Section title="Course Progress" icon={<FaBook />}>
          {Object.entries(studentData.role.course_progress || {}).map(([course, progress]) => (
            <ProgressBar key={course} label={course} progress={progress} />
          ))}
        </Section>

        <Section title="Quiz Scores" icon={<FaChartBar />}>
          {studentData.role.quiz_scores ? (
            Object.entries(studentData.role.quiz_scores).map(([course, scores]) => (
              <p key={course} className="text-gray-700">
                {course}: {scores.join(", ")}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No quiz scores available.</p>
          )}
        </Section>

        <Section title="Grades" icon={<FaBook />}>
          {Object.entries(studentData.role.grades || {}).map(([course, grade]) => (
            <p key={course} className="text-gray-700">
              {course}: <span className="font-bold text-violet-500">{grade || "N/A"}</span>
            </p>
          ))}
        </Section>

        <Section title="Projects" icon={<FaProjectDiagram />}>
          {studentData.role.projects ? (
            Object.entries(studentData.role.projects).map(([course, status]) => (
              <p key={course} className="text-gray-700">
                {course}: <span className="font-bold text-violet-500">{status}</span>
              </p>
            ))
          ) : (
            <p className="text-gray-500">No projects available.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="mt-6">
    <h3 className="text-2xl font-bold flex items-center text-violet-500">
      {icon} <span className="ml-2">{title}</span>
    </h3>
    <div className="mt-2 space-y-2">{children}</div>
  </div>
);

const ProgressBar = ({ label, progress }) => (
  <div className="mt-2">
    <p className="text-gray-700">{label}: {progress}%</p>
    <div className="w-full h-3 bg-gray-300 rounded-full mt-1 overflow-hidden">
      <div
        className="h-full bg-violet-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default StudentDashboard;
