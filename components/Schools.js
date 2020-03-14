import React, { useState } from 'react';
import UnenrolledStudents from './UnenrolledStudents';

const Schools = ({
  schools,
  students,
  updateStudent,
  schoolStudents,
  createSchoolStudent,
  deleteSchoolStudent,
  setUpdatingSchool,
  setUpdatingStudent,
  setVisibleViews,
}) => {
  const [student, setStudent] = useState('');
  const schoolsList = schools.map((school, i) => {
    const otherStudents = students.filter(stu => stu.school === '');
    const studentsList = otherStudents.map((student, i) => (
      <option key={i}>{student.name}</option>
    ));
    const enrolledSchoolStudents = schoolStudents.filter(
      schoolStudent => schoolStudent.schoolId === school.id
    );
    const enrolledStudents = enrolledSchoolStudents.map(
      enrolledSchoolStudent => {
        return students.find(stu => stu.id === enrolledSchoolStudent.studentId);
      }
    );

    const enrolledStudentsList = enrolledStudents.map((enrolledStudent, i) => {
      const studentUrl = '#view=student&id=' + enrolledStudent.id;

      return (
        <li key={i}>
          <a
            href={studentUrl}
            onClick={() => {
              setUpdatingStudent(enrolledStudent);
              setVisibleViews({ updateSchool: false, updateStudent: true });
            }}
          >
            <h2>{enrolledStudent.name}</h2>
          </a>
          <button
            className="unenrollButton"
            onClick={() => unenrollStudent(enrolledStudent)}
          >
            Unenroll
          </button>
        </li>
      );
    });

    const unenrollStudent = async enrolledStudent => {
      const schoolStudent = schoolStudents.find(
        schstu => schstu.studentId === enrolledStudent.id
      );
      deleteSchoolStudent(schoolStudent);
      updateStudent({
        name: enrolledStudent.name,
        school: '',
        id: enrolledStudent.id,
      });
    };

    const enrollStudent = e => {
      e.preventDefault();
      setStudent(e.target.value);
      const enrollingStudent = students.find(
        stu => stu.name === e.target.value
      );
      createSchoolStudent({
        schoolId: school.id,
        studentId: enrollingStudent.id,
      });
      updateStudent({
        name: enrollingStudent.name,
        school: school.name,
        id: enrollingStudent.id,
      });
      setStudent('');
    };
    const schoolUrl = '#view=school&id=' + school.id;

    return (
      <li key={i} className="schoolItem">
        <a
          href={schoolUrl}
          onClick={() => {
            setUpdatingSchool(school);
            setVisibleViews({ updateSchool: true, updateStudent: false });
          }}
        >
          <h2>{school.name}</h2>
        </a>
        <select value={student} onChange={enrollStudent}>
          <option value={student} defaultValue disabled>
            -- Enroll Student --
          </option>
          {studentsList}
        </select>
        <ul>{enrolledStudentsList}</ul>
      </li>
    );
  });
  return <ul id="schoolsDiv">{schoolsList}</ul>;
};

export default Schools;
