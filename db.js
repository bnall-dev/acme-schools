const pg = require('pg');
const format = require('pg-format');
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_schools'
);

client.connect();

const sync = async () => {
  const SQL = `
  DROP TABLE IF EXISTS school_students;
  DROP TABLE IF EXISTS students;
  DROP TABLE IF EXISTS schools;


  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL
  );


  CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    school VARCHAR
  );


  CREATE TABLE school_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "schoolId" UUID NOT NULL REFERENCES schools(id),
    "studentId" UUID NOT NULL REFERENCES students(id)
  );
  `;
  await client.query(SQL);
};

// SCHOOLS REQUESTS
const readSchools = async () => {
  return (await client.query('SELECT * FROM schools')).rows;
};
const readSchool = async id => {
  const SQL = 'SELECT * FROM schools WHERE id = $1';
  const response = await client.query(SQL, [id]);
};
const createSchool = async school => {
  const SQL = 'INSERT INTO schools (name) VALUES ($1) RETURNING *';
  const response = await client.query(SQL, [school.name]);
  return response.rows[0];
};
const updateSchool = async school => {
  const SQL = 'UPDATE schools SET name = $1  WHERE id=$2 RETURNING *';
  const response = await client.query(SQL, [school.name, school.id]);
  return response.rows[0];
};
const deleteSchool = async id => {
  const SQL = `DELETE FROM schools WHERE id=$1`;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

// STUDENTS REQUESTS
const readStudents = async () => {
  return (await client.query('SELECT * FROM students')).rows;
};
const readStudent = async id => {
  const SQL = 'SELECT * FROM students WHERE id = $1';
  const response = await client.query(SQL, [id]);
};
const createStudent = async student => {
  const SQL = 'INSERT INTO students (name, school) VALUES($1, $2) RETURNING *';
  const response = await client.query(SQL, [student.name, student.school]);
  return response.rows[0];
};
const updateStudent = async student => {
  const SQL =
    'UPDATE students SET name = $1, school = $2  WHERE id=$3 RETURNING *';
  const response = await client.query(SQL, [
    student.name,
    student.school,
    student.id,
  ]);
  return response.rows[0];
};
const deleteStudent = async id => {
  const SQL = `
  DELETE FROM students WHERE id=$1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

// SCHOOL STUDENTS REQUESTS
const readSchoolStudents = async () => {
  const SQL = 'SELECT * FROM school_students';
  const response = await client.query(SQL);
  return response.rows;
};
const readSchoolStudent = async id => {
  const SQL = 'SELECT * FROM school_students WHERE id = $1';
  const response = await client.query(SQL, [id]);
};
const createSchoolStudent = async schoolStudent => {
  const SQL =
    'INSERT INTO school_students ("schoolId", "studentId") VALUES ($1, $2) RETURNING *';
  const response = await client.query(SQL, [
    schoolStudent.schoolId,
    schoolStudent.studentId,
  ]);
  return response.rows[0];
};
const updateSchoolStudent = async schoolStudent => {
  const SQL =
    'UPDATE school_students SET "schoolId" = $1, "studentId" = $2 WHERE id=$3 RETURNING *';
  const response = await client.query(SQL, [
    schoolStudent.schoolId,
    schoolStudent.studentId,
    schoolStudent.id,
  ]);
  return response.rows[0];
};
const deleteSchoolStudent = async id => {
  const SQL = 'DELETE FROM school_students WHERE id=$1';
  const response = await client.query(SQL, [id]);
  return response.rows;
};

module.exports = {
  sync,

  readSchools,
  readSchool,
  createSchool,
  updateSchool,
  deleteSchool,

  readStudents,
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,

  readSchoolStudents,
  readSchoolStudent,
  createSchoolStudent,
  updateSchoolStudent,
  deleteSchoolStudent,
};
