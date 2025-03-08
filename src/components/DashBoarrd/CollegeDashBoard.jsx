import React, { useState } from "react";
import { FaBook, FaChartBar, FaProjectDiagram, FaUser, FaUniversity, FaSearch, FaEdit } from "react-icons/fa";
import axios from "axios";
import { link } from "../../BaseLink";

const CollegeDashboard = () => {
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState(null);
  const [editable, setEditable] = useState(false);

  const fetchStudentData = async () => {
    try {
      const response = await axios.post(`${link}/getcollegedetails`, { s_email: email });
      setStudent(response.data.user);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const saveStudentData = async () => {
    try {
      await axios.post(`${link}/editdetails`, {
        s_email: student.email,
        name: student.name,
        course_progress: student.role.course_progress,
        quiz_scores: student.role.quiz_scores,
        grades: student.role.grades,
        projects: student.role.projects
      });
      setEditable(false);
    } catch (error) {
      console.error("Error saving student data:", error);
    }
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
            {Object.entries(student.role.course_progress).map(([course, progress]) => (
              <EditableField
                key={course}
                label={course}
                value={progress}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({
                    ...student,
                    role: {
                      ...student.role,
                      course_progress: {
                        ...student.role.course_progress,
                        [course]: Number(newValue),
                      },
                    },
                  })
                }
              />
            ))}
          </Section>

          <Section title="Quiz Scores" icon={<FaChartBar />}>
            {Object.entries(student.role.quiz_scores).map(([course, scores]) => (
              <EditableField
                key={course}
                label={course}
                value={scores.join(", ")}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({
                    ...student,
                    role: {
                      ...student.role,
                      quiz_scores: {
                        ...student.role.quiz_scores,
                        [course]: newValue.split(",").map(Number),
                      },
                    },
                  })
                }
              />
            ))}
          </Section>

          <Section title="Grades" icon={<FaBook />}>
            {Object.entries(student.role.grades).map(([course, grade]) => (
              <EditableField
                key={course}
                label={course}
                value={grade}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({
                    ...student,
                    role: {
                      ...student.role,
                      grades: {
                        ...student.role.grades,
                        [course]: newValue,
                      },
                    },
                  })
                }
              />
            ))}
          </Section>

          <Section title="Projects" icon={<FaProjectDiagram />}>
            {Object.entries(student.role.projects).map(([course, status]) => (
              <EditableField
                key={course}
                label={course}
                value={status}
                editable={editable}
                onChange={(newValue) =>
                  setStudent({
                    ...student,
                    role: {
                      ...student.role,
                      projects: {
                        ...student.role.projects,
                        [course]: newValue,
                      },
                    },
                  })
                }
              />
            ))}
          </Section>

          <button
            onClick={() => {
              if (editable) saveStudentData();
              else setEditable(true);
            }}
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