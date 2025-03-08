import React from "react";
import { FaBook, FaChartBar, FaProjectDiagram, FaUser, FaBrain } from "react-icons/fa";

const student = {
  name: "Giriraj Roy",
  email: "roy.2004002@gmail.com",
  course_progress: {
    "Data Structures": 80,
    "Deep Learning": 100,
    "Blockchain": 20,
  },
  quiz_scores: {
    "Data Structures": [80, 95],
    "Deep Learning": [98, 85],
    "Blockchain": [30, 20],
  },
  grades: {
    "Data Structures": "A",
    "Deep Learning": "A",
    "Blockchain": "F",
  },
  projects: {
    "Data Structures": "Completed",
    "Deep Learning": "In Progress",
    "Blockchain": "Not Started",
  },
};

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-300 text-gray-900 flex flex-col items-center px-6 py-12">
      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-lg border border-gray-300">
        {/* Student Info */}
        <div className="flex items-center space-x-4 border-b pb-4 border-gray-300">
          <FaUser className="text-4xl text-violet-500" />
          <div>
            <h2 className="text-3xl font-bold">{student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
          </div>
        </div>

        {/* Course Progress */}
        <Section title="Course Progress" icon={<FaBook />}> 
          {Object.entries(student.course_progress).map(([course, progress]) => (
            <ProgressBar key={course} label={course} progress={progress} />
          ))}
        </Section>

        {/* Quiz Scores */}
        <Section title="Quiz Scores" icon={<FaChartBar />}> 
          {Object.entries(student.quiz_scores).map(([course, scores]) => (
            <p key={course} className="text-gray-700">{course}: {scores.join(", ")}</p>
          ))}
        </Section>

        {/* Grades */}
        <Section title="Grades" icon={<FaBook />}> 
          {Object.entries(student.grades).map(([course, grade]) => (
            <p key={course} className="text-gray-700">
              {course}: <span className="font-bold text-violet-500">{grade}</span>
            </p>
          ))}
        </Section>

        {/* Projects */}
        <Section title="Projects" icon={<FaProjectDiagram />}> 
          {Object.entries(student.projects).map(([course, status]) => (
            <p key={course} className="text-gray-700">
              {course}: <span className="font-bold text-violet-500">{status}</span>
            </p>
          ))}
        </Section>

        {/* AI-Based Analytics */}
        <Section title="AI-Based Analytics" icon={<FaBrain />}> 
          <p className="text-gray-700 font-bold">Performance Score: 70/100</p>
          <h4 className="text-xl font-semibold text-violet-500 mt-4">Strengths:</h4>
          <ul className="list-disc ml-5 text-gray-700">
            <li><strong>Excellent Deep Learning Skills:</strong> Consistently high scores and near-completion of the project demonstrate strong understanding and application. This is commendable!</li>
          </ul>

          <h4 className="text-xl font-semibold text-violet-500 mt-4">Skill Gaps:</h4>
          <ul className="list-disc ml-5 text-gray-700">
            <li><strong>Blockchain Fundamentals:</strong> Significant struggle indicated by low scores, project incompletion, and failing grade. Needs foundational knowledge in this area.</li>
            <li><strong>Time Management/Prioritization:</strong> Delay in starting and incomplete Blockchain project suggests issues with managing workload and deadlines.</li>
          </ul>

          <h4 className="text-xl font-semibold text-violet-500 mt-4">Learning Recommendations:</h4>
          <ul className="list-disc ml-5 text-gray-700">
            <li><strong>Blockchain:</strong> Focus on fundamental concepts through additional resources (online courses, textbooks). Seek extra help from instructors or peers.</li>
            <li><strong>Time Management:</strong> Develop a study schedule, break down large projects into smaller tasks, and prioritize assignments effectively.</li>
          </ul>

          <h4 className="text-xl font-semibold text-violet-500 mt-4">Courses:</h4>
          <ul className="list-disc ml-5 text-gray-700">
            <li><strong>Introduction to Blockchain Technology:</strong> (Focus: Fundamentals, smart contracts, consensus mechanisms)</li>
            <li><strong>Effective Time Management for Students:</strong> (Focus: Prioritization, scheduling, stress management)</li>
            <li><strong>Data Structures and Algorithms (Intermediate):</strong> (Reinforce Data Structures knowledge and improve problem-solving skills to aid Blockchain understanding)</li>
          </ul>

          <h4 className="text-xl font-semibold text-violet-500 mt-4">Project Ideas:</h4>
          <ul className="list-disc ml-5 text-gray-700">
            <li><strong>Simple Blockchain Implementation:</strong> Build a basic blockchain in Python (focus: understanding core concepts).</li>
            <li><strong>Time Management Project:</strong> Track daily tasks/assignments for a month, analyzing productivity and areas for improvement.</li>
          </ul>

          <h4 className="text-xl font-semibold text-violet-500 mt-4">Study Materials:</h4>
          <ul className="list-disc ml-5 text-gray-700">
            <li><strong>Blockchain:</strong>
              <ul className="list-disc ml-5">
                <li><strong>Book:</strong> "Mastering Bitcoin" by Andreas M. Antonopoulos</li>
                <li><strong>Video:</strong> "Blockchain and Bitcoin Fundamentals" (Coursera/edX - choose a reputable course)</li>
              </ul>
            </li>
            <li><strong>Time Management:</strong>
              <ul className="list-disc ml-5">
                <li><strong>Article:</strong> "10 Time Management Tips for Students" (search for reputable articles online)</li>
                <li><strong>Video:</strong> Time management techniques for students (YouTube - search for reputable channels)</li>
              </ul>
            </li>
          </ul>
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
