import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Switch, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search } from "@/components/ui/search";

function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: '', body: '', isPinned: false, isFavorite: false, isArchived: false });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    if (currentNote.title || currentNote.body) {
      setNotes(prevNotes => [...prevNotes, { ...currentNote, id: Date.now() }]);
      setCurrentNote({ title: '', body: '', isPinned: false, isFavorite: false, isArchived: false });
    }
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
  };

  const handleSaveEdit = () => {
    setNotes(notes.map(n => n.id === currentNote.id ? currentNote : n));
    setCurrentNote({ title: '', body: '', isPinned: false, isFavorite: false, isArchived: false });
  };

  const handleDeleteNote = (id) => {
    setNoteToDelete(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    setNotes(notes.filter(n => n.id !== noteToDelete));
    setDialogOpen(false);
  };

  const handleArchiveNote = (id, archiveStatus) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isArchived: archiveStatus } : n));
  };

  const handlePinNote = (id, pinStatus) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isPinned: pinStatus } : n));
  };

  const handleFavoriteNote = (id, favStatus) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isFavorite: favStatus } : n));
  };

  const filteredNotes = notes.filter(note => 
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     note.body.toLowerCase().includes(searchTerm.toLowerCase())) && 
    !note.isArchived
  );

  const archivedNotes = notes.filter(note => note.isArchived);
  const favoriteNotes = notes.filter(note => note.isFavorite && !note.isArchived);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto p-4 sm:p-8">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Notes App</h1>
          <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)}>Toggle Theme</Switch>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={currentNote.title} 
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} 
              placeholder="Title" 
              className="mb-2"
            />
            <textarea 
              value={currentNote.body} 
              onChange={(e) => setCurrentNote({...currentNote, body: e.target.value})} 
              placeholder="Write your note here..." 
              className="w-full h-24 mb-2 p-2 border rounded"
            />
          </CardContent>
          <CardFooter>
            {currentNote.id ? 
              <Button onClick={handleSaveEdit}>Save Edit</Button> : 
              <Button onClick={handleCreateNote}>Create Note</Button>
            }
          </CardFooter>
        </Card>
        
        <Search 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search notes..." 
          className="my-4"
        />

        <section>
          <h2 className="text-xl mb-2">Favorites</h2>
          {favoriteNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onEdit={handleEditNote} 
              onDelete={handleDeleteNote} 
              onArchive={handleArchiveNote} 
              onPin={handlePinNote} 
              onFavorite={handleFavoriteNote}
            />
          ))}
        </section>

        <section>
          <h2 className="text-xl mb-2">All Notes</h2>
          {filteredNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onEdit={handleEditNote} 
              onDelete={handleDeleteNote} 
              onArchive={handleArchiveNote} 
              onPin={handlePinNote} 
              onFavorite={handleFavoriteNote}
            />
          ))}
        </section>

        {archivedNotes.length > 0 && (
          <section>
            <h2 className="text-xl mb-2">Archived Notes</h2>
            {archivedNotes.map(note => (
              <NoteItem 
                key={note.id} 
                note={note} 
                onEdit={handleEditNote} 
                onDelete={handleDeleteNote} 
                onArchive={handleArchiveNote} 
                onPin={handlePinNote} 
                onFavorite={handleFavoriteNote}
              />
            ))}
          </section>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action will permanently delete the note. Proceed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={confirmDelete} className="bg-red-500 text-white">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function NoteItem({ note, onEdit, onDelete, onArchive, onPin, onFavorite }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{note.body}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div>
          <Button onClick={() => onEdit(note)}>Edit</Button>
          <Button onClick={() => onDelete(note.id)} className="ml-2 bg-red-500 text-white">Delete</Button>
        </div>
        <div>
          <Button onClick={() => onArchive(note.id, !note.isArchived)}>
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </Button>
          <Button onClick={() => onPin(note.id, !note.isPinned)} className="ml-2">
            {note.isPinned ? 'Unpin' : 'Pin'}
          </Button>
          <Button onClick={() => onFavorite(note.id, !note.isFavorite)} className="ml-2">
            {note.isFavorite ? 'Unfavorite' : 'Favorite'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default App;