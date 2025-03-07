import { useState } from 'react';

function StudentDetails({ onSubmit }) {
  const [studentAddress, setStudentAddress] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const handleSubmit = () => {
    onSubmit({ studentAddress, name, degree, completionDate });
  };

  return (
    <div className="section">
      <h2>Student Details</h2>
      <input value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} placeholder="Student Address" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" />
      <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Degree" />
      <input value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} type="date" placeholder="Completion Date" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default StudentDetails;