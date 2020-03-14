import React, { useState } from 'react';
import UnenrolledStudents from './UnenrolledStudents';

const UpdateSchool = ({
  schools,
  students,
  updateSchool,
  updatingSchool,
  setUpdatingSchool,
  deleteSchool,
  setVisibleViews,
  setUnenrolledStudents,
  unenrolledStudents,
}) => {
  const enrolledStudents = students.filter(
    stu => stu.school === updatingSchool.name
  );
  return (
    <form
      id="updateSchoolForm"
      onSubmit={e => {
        e.preventDefault();
        updateSchool(updatingSchool);
        setUpdatingSchool({ id: updatingSchool.id, name: '' });
        setVisibleViews({ updateSchool: false, updateStudent: false });
      }}
    >
      <h2>Update School</h2>
      <input
        type="text"
        value={updatingSchool.name}
        onChange={e => {
          setUpdatingSchool({ id: updatingSchool.id, name: e.target.value });
        }}
      ></input>
      <input type="submit" value="Update" />
      <button
        className="deleteButton"
        onClick={e => {
          const newArray = [...unenrolledStudents];
          enrolledStudents.map(stu => {
            stu.school = '';
            newArray.push(stu);
          });
          setUnenrolledStudents([...newArray]);
          deleteSchool(updatingSchool);
          setVisibleViews({ updateSchool: false, updateStudent: false });
        }}
      >
        Delete School
      </button>
    </form>
  );
};

export default UpdateSchool;
