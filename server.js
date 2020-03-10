const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const db = require('./db');
app.use(require('cors')());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

var myLogger = function(req, res, next) {
  console.log(req.body);
  next();
};
app.use(myLogger);

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

// SCHOOLS REQUESTS
app.get('/api/schools', (req, res, next) => {
  db.readSchools()
    .then(schools => res.send(schools))
    .catch(next);
});
app.get('/api/schools/:id', (req, res, next) => {
  const id = req.params.id;
  db.readSchool(req.params.id)
    .then(school => res.send(school))
    .catch(next);
});
app.post('/api/schools/', (req, res, next) => {
  db.createSchool(req.body)
    .then(school => res.send(school))
    .catch(next);
});
app.delete('/api/schools/:id', (req, res, next) => {
  db.deleteSchool(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
app.put('/api/schools/:id', (req, res, next) => {
  const id = req.params.id;
  db.updateSchool(req.body).then(updated => {
    res.send(updated);
  });
});

// STUDENTS REQUESTS
app.get('/api/students', (req, res, next) => {
  db.readStudents()
    .then(students => res.send(students))
    .catch(next);
});
app.get('/api/students/:id', (req, res, next) => {
  const id = req.params.id;
  db.readStudent(req.params.id)
    .then(student => res.send(student))
    .catch(next);
});
app.post('/api/students', (req, res, next) => {
  db.createStudent(req.body)
    .then(student => res.send(student))
    .catch(next);
});
app.delete('/api/students/:id', (req, res, next) => {
  db.deleteStudent(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
app.put('/api/students/:id', (req, res, next) => {
  const id = req.params.id;
  db.updateStudent(req.body).then(updated => {
    res.send(updated);
  });
});

// SCHOOL STUDENTS REQUESTS
app.get('/api/school_students', (req, res, next) => {
  db.readSchoolStudents()
    .then(schoolStudents => res.send(schoolStudents))
    .catch(next);
});
app.get('/api/school_students/:id', (req, res, next) => {
  const id = req.params.id;
  db.readSchoolStudent(req.params.id)
    .then(schoolStudent => res.send(schoolStudent))
    .catch(next);
});
app.post('/api/school_students', (req, res, next) => {
  db.createSchoolStudent(req.body)
    .then(schoolStudent => res.send(schoolStudent))
    .catch(next);
});

app.delete('/api/school_students/:id', (req, res, next) => {
  db.deleteSchoolStudent(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
app.put('/api/school_students/:id', (req, res, next) => {
  const id = req.params.id;
  db.updateSchoolStudent(req.body).then(updated => {
    res.send(updated);
  });
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});
