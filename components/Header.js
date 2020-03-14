import React, { useState } from 'react';

const Header = ({ schools, students, unenrolledStudents, setVisibleViews }) => {
  return (
    <header>
      <a
        href="#"
        onClick={() =>
          setVisibleViews({ updateSchool: false, updateStudent: false })
        }
      >
        <h1>Acme Schools</h1>
      </a>
      <h5>{schools.length} Schools</h5>
      <h5>{students.length} Students</h5>
      <h5>{unenrolledStudents.length} Unenrolled Students</h5>
    </header>
  );
};

export default Header;
