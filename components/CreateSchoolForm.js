import React, { useState } from 'react';
import axios from 'axios';

const CreateSchoolForm = ({ createSchool }) => {
  const [name, setName] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    createSchool({ name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create School</h2>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      ></input>

      <input type="submit" value="Create" />
    </form>
  );
};

export default CreateSchoolForm;
