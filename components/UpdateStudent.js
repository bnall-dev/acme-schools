import React, { useState } from 'react';
import UnenrolledStudents from './UnenrolledStudents';

const UpdateStudent = ({
  updateStudent,
  updatingStudent,
  setUpdatingStudent,
  deleteStudent,
  setVisibleViews,
  unenrolledStudents,
  setUnenrolledStudents,
}) => {
  return (
    <form
      id="updateStudentForm"
      onSubmit={e => {
        e.preventDefault();
        updateStudent(updatingStudent);
        setUpdatingStudent({
          id: updatingStudent.id,
          name: '',
          school: updatingStudent.school,
        });
        setVisibleViews({ updateSchool: false, updateStudent: false });
      }}
    >
      <h2>Update Student</h2>
      <input
        type="text"
        value={updatingStudent.name}
        onChange={e => {
          setUpdatingStudent({
            id: updatingStudent.id,
            name: e.target.value,
            school: updatingStudent.school,
          });
        }}
      ></input>
      <input type="submit" value="Update" />
      <button
        className="deleteButton"
        onClick={e => {
          deleteStudent(updatingStudent);
          setVisibleViews({ updateSchool: false, updateStudent: false });
        }}
      >
        Delete Student
      </button>
    </form>
  );
};

export default UpdateStudent;
