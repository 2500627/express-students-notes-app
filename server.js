const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;
const FILE_PATH = 'students.json';

app.use(express.json());

function loadStudents() {
  try {
    const dataBuffer = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(dataBuffer);
  } catch (error) {
    return [];
  }
}

function saveStudents(students) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(students, null, 2));
}

// 1. GET /students (Bonus: Filter by program e.g. /students?program=BSCS)
app.get('/students', (req, res) => {
  let students = loadStudents();
  const { program } = req.query;

  if (program) {
    students = students.filter(s => s.program.toLowerCase() === program.toLowerCase());
  }

  res.status(200).json(students);
});

// 2. GET /students/:id
app.get('/students/:id', (req, res) => {
  const students = loadStudents();
  const studentId = parseInt(req.params.id);
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.status(200).json(student);
});

// 3. POST /students (With validation)
app.post('/students', (req, res) => {
  const { name, email, program } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Validation Error: Name is required' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Validation Error: Email must contain @' });
  }
  if (!program || typeof program !== 'string' || program.trim() === '') {
    return res.status(400).json({ error: 'Validation Error: Program is required' });
  }

  const students = loadStudents();
  const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;

  const newStudent = { id: newId, name: name.trim(), email: email.trim(), program: program.trim() };
  students.push(newStudent);
  saveStudents(students);

  res.status(201).json({ message: 'Student created successfully!', student: newStudent });
});

// 4. PUT /students/:id
app.put('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, email, program } = req.body;
  const students = loadStudents();
  const index = students.findIndex(s => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  if (email && (!typeof email === 'string' || !email.includes('@'))) {
    return res.status(400).json({ error: 'Validation Error: Email must contain @' });
  }

  students[index] = {
    ...students[index],
    ...(name && { name: name.trim() }),
    ...(email && { email: email.trim() }),
    ...(program && { program: program.trim() })
  };

  saveStudents(students);
  res.status(200).json({ message: 'Student updated successfully!', student: students[index] });
});

// 5. DELETE /students/:id
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  let students = loadStudents();

  if (!students.some(s => s.id === studentId)) {
    return res.status(404).json({ error: 'Student not found' });
  }

  students = students.filter(s => s.id !== studentId);
  saveStudents(students);
  res.status(200).json({ message: `Student with ID ${studentId} deleted successfully.` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});