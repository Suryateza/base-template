// App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useTheme } from 'next-themes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', body: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { setTheme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setTheme]);

  const addNote = () => {
    if (currentNote.title || currentNote.body) {
      setNotes([...notes, { ...currentNote, id: Date.now(), favorite: false, pinned: false, archived: false }]);
      setCurrentNote({ id: null, title: '', body: '' });
    }
  };

  const updateNote = (note) => {
    setNotes(notes.map(n => n.id === note.id ? note : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    setIsDialogOpen(false);
  };

  const filteredNotes = notes.filter(note => 
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     note.body.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !note.archived
  );

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notes App</h1>
        <Switch checked={isDarkMode} onCheckedChange={() => setIsDarkMode(!isDarkMode)}>Dark Mode</Switch>
      </div>
      <Input 
        placeholder="Search notes..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.pinned && '📌 '} {note.title}</CardTitle>
            </CardHeader>
            <CardContent>{note.body}</CardContent>
            <CardFooter>
              <Button onClick={() => setCurrentNote(note)}>Edit</Button>
              <Button onClick={() => setIsDialogOpen(true)} color="destructive">Delete</Button>
              <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => deleteNote(note.id)}>Confirm Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Input value={currentNote.title} onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} placeholder="Title" />
        <Textarea value={currentNote.body} onChange={(e) => setCurrentNote({...currentNote, body: e.target.value})} placeholder="Your note here..." className="mt-2" />
        <Button onClick={currentNote.id ? () => {updateNote(currentNote); setCurrentNote({ id: null, title: '', body: '' });} : addNote} className="mt-2">
          {currentNote.id ? 'Save Changes' : 'Add Note'}
        </Button>
      </div>
    </div>
  );
};

export default App;