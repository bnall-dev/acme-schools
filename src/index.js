import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Header from '../../components/Header';
import CreateStudent from '../../components/CreateStudent';
import CreateSchool from '../../components/CreateSchool';
import Schools from '../../components/Schools';

const root = document.querySelector('#root');

const App = () => {
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [view, setView] = useState('#');

  useEffect(() => {
    Promise.all([axios.get('/api/schools'), axios.get('/api/students')])
      .then(responses => responses.map(response => response.data))
      .then(results => {
        setSchools(results[0]);
        setStudents(results[1]);
      })
      .catch(ex => setError(ex.response.data.message));
  }, []);

  useEffect(() => {
    Promise.all([axios.get('/api/school_students')])
      .then(responses => responses.map(response => response.data))
      .then(results => {
        setSchoolStudents(results[0]);
      })
      .catch(ex => setError(ex.response.data.message));
  }, []);

  //SCHOOLS REQUESTS
  const createSchool = async school => {
    const created = (await axios.post('/api/schools/', school)).data;
    setSchools([...schools, created]);
  };
  const deleteSchool = async schoolToDestroy => {
    const enrolledStudents = schoolStudents.filter(
      schoolStudent => schoolStudent.schoolId === schoolToDestroy.id
    );
    if (enrolledStudents.length === 0) {
      await axios.delete(`/api/schools/${schoolToDestroy.id}`);
      setSchools(schools.filter(school => school.id !== schoolToDestroy.id));
    } else {
      enrolledStudents.map(student => {
        axios.delete(`/api/school_students/${student.id}`);
        setSchoolStudents(
          schoolStudents.filter(
            schoolStudent => schoolStudent.id !== student.id
          )
        );
      });
      await axios.delete(`/api/schools/${schoolToDestroy.id}`);
      setSchools(schools.filter(school => school.id !== schoolToDestroy.id));
    }
  };

  //STUDENTS REQUESTS
  const createStudent = async chore => {
    const created = (await axios.post('/api/students/', student)).data;
    setStudents([...students, created]);
  };
  const deleteStudent = async studentToDestroy => {
    const enrolledStudents = schoolStudents.filter(
      schoolStudent => schoolStudent.choreId === studentToDestroy.id
    );
    if (enrolledStudents.length === 0) {
      await axios.delete(`/api/student/${studentToDestroy.id}`);
      setStudents(
        students.filter(student => student.id !== studentToDestroy.id)
      );
    } else {
      await axios.delete(`/api/school_students/${enrolledStudents[0].id}`);
      setSchoolStudents(
        schoolStudents.filter(
          schoolStudent => schoolStudent.id !== enrolledStudents[0].id
        )
      );
      await axios.delete(`/api/students/${studentToDestroy.id}`);
      setStudents(
        students.filter(student => student.id !== studentToDestroy.id)
      );
    }
  };

  //SCHOOL STUDENTS REQUESTS
  const deleteSchoolStudent = async schoolStudentToDestroy => {
    await axios.delete(`/api/school_students/${schoolStudentToDestroy.id}`);
    setSchoolStudents(
      schoolStudents.filter(
        schoolStudent => schoolStudent.id !== schoolStudentToDestroy.id
      )
    );
  };

  return (
    <div id="app">
      <Header />
      <CreateStudent />
      <CreateSchool />
      <Schools />
    </div>
  );
};

ReactDOM.render(<App />, root);
