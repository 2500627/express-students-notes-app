const fs = require('fs');
const FILE_PATH = 'notes.json';

function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(dataBuffer);
  } catch (error) {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(notes, null, 2));
}

const command = process.argv[2];
const argument = process.argv[3];

if (command === 'add') {
  if (!argument) {
    console.log('Error: Please provide text for the note.');
  } else {
    const notes = loadNotes();
    notes.push(argument);
    saveNotes(notes);
    console.log(`Note added: "${argument}"`);
  }
} 
else if (command === 'list') {
  const notes = loadNotes();
  if (notes.length === 0) {
    console.log('No notes found.');
  } else {
    notes.forEach((note, index) => {
      console.log(`${index + 1}. ${note}`);
    });
  }
} 
else if (command === 'clear') {
  saveNotes([]);
  console.log('All notes cleared.');
} 
else {
  console.log('Invalid command! Available commands: add, list, clear');
}