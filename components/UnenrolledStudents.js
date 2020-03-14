import React, { useState, useEffect } from 'react';

const UnenrolledStudents = ({
  schools,
  students,
  unenrolledStudents,
  setUnenrolledStudents,
  setUpdatingStudent,
  setVisibleViews,
  visibleUnenrolled,
  setVisibleUnenrolled,
}) => {
  useEffect(() => {
    setUnenrolledStudents(students.filter(stu => stu.school === ''));
  }, [students]);
  useEffect(() => {
    if (unenrolledStudents.length > 0) {
      setVisibleUnenrolled({ istrue: true });
    } else {
      setVisibleUnenrolled({ istrue: false });
    }
  }, [students]);

  const unenrolledStudentsList = unenrolledStudents.map(
    (unenrolledStudent, i) => {
      const studentUrl = '#view=student&id=' + unenrolledStudent.id;

      return (
        <li key={i}>
          <a
            href={studentUrl}
            onClick={() => {
              setUpdatingStudent(unenrolledStudent);
              setVisibleViews({ updateSchool: false, updateStudent: true });
            }}
          >
            <h2>{unenrolledStudent.name}</h2>
          </a>
        </li>
      );
    }
  );

  return (
    <ul id="unenrolledStudents">
      <h2>Unenrolled Students</h2>
      {unenrolledStudentsList}
    </ul>
  );
};

export default UnenrolledStudents;
