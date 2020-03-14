import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateStudentForm = ({
  schools,
  students,
  setStudents,
  createStudent,
  unenrolledStudents,
  createSchoolStudent,
  setUnenrolledStudents,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentSchool, setStudentSchool] = useState('');
  const schoolsList = schools.map((school, i) => {
    return <option key={i}>{school.name}</option>;
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const enrolledStudent = await createStudent({
      name: studentName,
      school: studentSchool,
    });

    if (studentSchool !== '') {
      const enrolledSchool = schools.find(sch => sch.name === studentSchool);
      createSchoolStudent({
        schoolId: enrolledSchool.id,
        studentId: enrolledStudent.id,
      });
    }
    setStudentName('');
    setStudentSchool('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Student</h2>
      <input
        type="text"
        value={studentName}
        onChange={e => setStudentName(e.target.value)}
      ></input>
      <select
        value={studentSchool}
        onChange={async e => {
          setStudentSchool(e.target.value);
        }}
      >
        <option defaultValue>-- Select School --</option>
        {schoolsList}
      </select>
      <input type="submit" value="Create" />
    </form>
  );
};

export default CreateStudentForm;
