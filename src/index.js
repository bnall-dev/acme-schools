import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/Header';
import CreateStudentForm from '../components/CreateStudentForm';
import CreateSchoolForm from '../components/CreateSchoolForm';
import UnenrolledStudents from '../components/UnenrolledStudents';
import Schools from '../components/Schools';
import UpdateSchool from '../components/UpdateSchool';
import UpdateStudent from '../components/UpdateStudent';

const root = document.querySelector('#root');

const App = () => {
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [updatingSchool, setUpdatingSchool] = useState({});
  const [updatingStudent, setUpdatingStudent] = useState({});
  const [view, setView] = useState('#');

  const [visibleViews, setVisibleViews] = useState({
    updateSchool: false,
    updateStudent: false,
  });
  const [visibleUnenrolled, setVisibleUnenrolled] = useState({
    istrue: false,
  });

  // whichever code needs to update the view can call setstate and update the visibleViews
  useEffect(() => {
    Promise.all([axios.get('/api/schools/')])
      .then(responses => responses.map(response => response.data))
      .then(results => {
        setSchools(results[0]);
      })
      .catch(ex => setError(ex.response.data.message));
  }, []);

  useEffect(() => {
    Promise.all([axios.get('/api/students')])
      .then(responses => responses.map(response => response.data))
      .then(results => {
        setStudents(results[0]);
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

  const updateSchool = async schoolToUpdate => {
    const schoolsCopy = [...schools];
    const school = schoolsCopy.find(sch => sch.id === schoolToUpdate.id);
    const updated = await axios.put(`/api/schools/${schoolToUpdate.id}`).data;
    const schoolIndex = schoolsCopy.indexOf(school);
    schoolsCopy.splice(schoolIndex, 1, schoolToUpdate);
    setSchools([...schoolsCopy]);
  };

  //STUDENTS REQUESTS
  const createStudent = async student => {
    const created = (await axios.post('/api/students/', student)).data;
    setStudents([...students, created]);
    return created;
  };
  const deleteStudent = async studentToDestroy => {
    const enrolledStudents = schoolStudents.filter(
      schoolStudent => schoolStudent.studentId === studentToDestroy.id
    );
    if (enrolledStudents.length === 0) {
      await axios.delete(`/api/students/${studentToDestroy.id}`);
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
  const updateStudent = async studentToUpdate => {
    const studentsCopy = [...students];
    const updated = await axios.put(
      `/api/students/${studentToUpdate.id}`,
      studentToUpdate
    ).data;
    const updatingStudent = studentsCopy.find(
      stu => stu.id === studentToUpdate.id
    );
    const upDatingStudentIndex = studentsCopy.indexOf(updatingStudent);
    studentsCopy.splice(upDatingStudentIndex, 1, studentToUpdate);
    setStudents(studentsCopy);
  };

  //SCHOOL STUDENTS REQUESTS
  const createSchoolStudent = async schoolStudent => {
    const created = (await axios.post(`api/school_students/`, schoolStudent))
      .data;

    setSchoolStudents([...schoolStudents, created]);
  };

  const deleteSchoolStudent = async schoolStudentToDestroy => {
    await axios.delete(`/api/school_students/${schoolStudentToDestroy.id}`);
    setSchoolStudents(
      schoolStudents.filter(
        schoolStudent => schoolStudent.id !== schoolStudentToDestroy.id
      )
    );
  };

  const [unenrolledStudents, setUnenrolledStudents] = useState(
    students.filter(stu => stu.school === '')
  );

  return (
    <div id="app">
      {view === '#' && (
        <Header
          students={students}
          schools={schools}
          unenrolledStudents={unenrolledStudents}
          setVisibleViews={setVisibleViews}
        />
      )}

      <div id="forms">
        {!visibleViews.updateStudent && !visibleViews.updateSchool && (
          <CreateStudentForm
            schools={schools}
            students={students}
            setStudents={setStudents}
            createStudent={createStudent}
            createSchoolStudent={createSchoolStudent}
            unenrolledStudents={unenrolledStudents}
            setUnenrolledStudents={setUnenrolledStudents}
          />
        )}
        {!visibleViews.updateStudent && !visibleViews.updateSchool && (
          <CreateSchoolForm createSchool={createSchool} />
        )}
      </div>
      <div id="lists">
        {!visibleViews.updateStudent && !visibleViews.updateSchool && (
          <UnenrolledStudents
            unenrolledStudents={unenrolledStudents}
            setUpdatingStudent={setUpdatingStudent}
            setVisibleViews={setVisibleViews}
            setVisibleUnenrolled={setVisibleUnenrolled}
            setUnenrolledStudents={setUnenrolledStudents}
            students={students}
            schools={schools}
            visibleUnenrolled={visibleUnenrolled}
          />
        )}
        {!visibleViews.updateStudent && !visibleViews.updateSchool && (
          <Schools
            schools={schools}
            students={students}
            updateStudent={updateStudent}
            schoolStudents={schoolStudents}
            deleteSchoolStudent={deleteSchoolStudent}
            createSchoolStudent={createSchoolStudent}
            setUpdatingSchool={setUpdatingSchool}
            setUpdatingStudent={setUpdatingStudent}
            setVisibleViews={setVisibleViews}
          />
        )}
      </div>
      {visibleViews.updateSchool && (
        <UpdateSchool
          schools={schools}
          students={students}
          updateStudent={updateStudent}
          schoolStudents={schoolStudents}
          deleteSchoolStudent={deleteSchoolStudent}
          createSchoolStudent={createSchoolStudent}
          updateSchool={updateSchool}
          setUpdatingSchool={setUpdatingSchool}
          updatingSchool={updatingSchool}
          deleteSchool={deleteSchool}
          setVisibleViews={setVisibleViews}
          unenrolledStudents={unenrolledStudents}
          setUnenrolledStudents={setUnenrolledStudents}
        />
      )}
      {visibleViews.updateStudent && (
        <UpdateStudent
          schools={schools}
          students={students}
          updateStudent={updateStudent}
          schoolStudents={schoolStudents}
          deleteSchoolStudent={deleteSchoolStudent}
          createSchoolStudent={createSchoolStudent}
          setUpdatingStudent={setUpdatingStudent}
          updatingStudent={updatingStudent}
          deleteStudent={deleteStudent}
          setVisibleViews={setVisibleViews}
          unenrolledStudents={unenrolledStudents}
          setUnenrolledStudents={setUnenrolledStudents}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, root);
