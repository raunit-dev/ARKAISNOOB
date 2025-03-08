import React, { useState } from "react";
import { FaBook, FaChartBar, FaProjectDiagram, FaUser, FaUniversity, FaSearch, FaEdit } from "react-icons/fa";

const CollegeDashboard = () => {
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState(null);
  const [editable, setEditable] = useState(false);

  const fetchStudentData = () => {
    const mockData = {
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
    setStudent(mockData);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold text-violet-600 flex items-center">
        <FaUniversity className="mr-3" /> Heritage Institute of Technology
      </h1>
      <div className="mt-6 flex space-x-4 bg-white p-4 rounded-lg shadow-md border border-gray-300">
        <input
          type="email"
          placeholder="Enter Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg outline-none w-72"
        />
        <button
          onClick={fetchStudentData}
          className="bg-violet-500 text-white px-6 py-2 rounded-lg flex items-center hover:bg-violet-600 transition"
        >
          <FaSearch className="mr-2" /> Search Student
        </button>
      </div>

      {student && (
        <div className="mt-6 max-w-4xl w-full bg-white p-6 rounded-xl shadow-lg border border-gray-300">
          <div className="flex items-center space-x-4 border-b pb-4 border-gray-300">
            <FaUser className="text-4xl text-violet-500" />
            <div>
              <h2 className="text-3xl font-bold">
                {editable ? (
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  student.name
                )}
              </h2>
              <p className="text-gray-600">{student.email}</p>
            </div>
          </div>

          <Section title="Course Progress" icon={<FaBook />}>
            {Object.entries(student.course_progress).map(([course, progress]) => (
              <EditableField
                key={course}
                label={course}
                value={progress}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({
                    ...student,
                    course_progress: { ...student.course_progress, [course]: Number(newValue) },
                  })
                }
              />
            ))}
          </Section>

          <Section title="Quiz Scores" icon={<FaChartBar />}>
            {Object.entries(student.quiz_scores).map(([course, scores]) => (
              <EditableField
                key={course}
                label={course}
                value={scores.join(", ")}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({
                    ...student,
                    quiz_scores: { ...student.quiz_scores, [course]: newValue.split(",").map(Number) },
                  })
                }
              />
            ))}
          </Section>

          <Section title="Grades" icon={<FaBook />}>
            {Object.entries(student.grades).map(([course, grade]) => (
              <EditableField
                key={course}
                label={course}
                value={grade}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({ ...student, grades: { ...student.grades, [course]: newValue } })
                }
              />
            ))}
          </Section>

          <Section title="Projects" icon={<FaProjectDiagram />}>
            {Object.entries(student.projects).map(([course, status]) => (
              <EditableField
                key={course}
                label={course}
                value={status}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({ ...student, projects: { ...student.projects, [course]: newValue } })
                }
              />
            ))}
          </Section>

          <button
            onClick={() => setEditable(!editable)}
            className="mt-4 bg-violet-500 text-white px-6 py-2 rounded-lg flex items-center hover:bg-violet-600 transition"
          >
            <FaEdit className="mr-2" /> {editable ? "Save Changes" : "Edit Details"}
          </button>
        </div>
      )}
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

const EditableField = ({ label, value, editable, onChange }) => (
  <div className="mt-2">
    <p className="text-gray-700 font-medium">{label}:</p>
    {editable ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
    ) : (
      <p className="text-gray-700">{value}</p>
    )}
  </div>
);

export default CollegeDashboard;
