import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function App() {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [newNote, setNewNote] = useState({ title: "", body: "" });
    const [isEditing, setIsEditing] = useState(null);

    // Load from localStorage
    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        setNotes(storedNotes);
    }, []);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Create or Edit Note
    const saveNote = () => {
        if (isEditing !== null) {
            const updatedNotes = notes.map((note, index) =>
                index === isEditing ? { ...note, ...newNote } : note
            );
            setNotes(updatedNotes);
        } else {
            setNotes([
                ...notes,
                { ...newNote, id: Date.now(), pinned: false, favorite: false, archived: false },
            ]);
        }
        setNewNote({ title: "", body: "" });
        setIsEditing(null);
    };

    // Edit a note
    const editNote = (index) => {
        setIsEditing(index);
        setNewNote({ title: notes[index].title, body: notes[index].body });
    };

    // Delete Note
    const deleteNote = (index) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            const updatedNotes = notes.filter((_, i) => i !== index);
            setNotes(updatedNotes);
        }
    };

    // Archive Note
    const archiveNote = (index) => {
        const updatedNotes = notes.map((note, i) =>
            i === index ? { ...note, archived: !note.archived } : note
        );
        setNotes(updatedNotes);
    };

    // Pin Note
    const togglePinNote = (index) => {
        const updatedNotes = notes.map((note, i) =>
            i === index ? { ...note, pinned: !note.pinned } : note
        );
        setNotes(updatedNotes);
    };

    // Mark as Favorite
    const toggleFavoriteNote = (index) => {
        const updatedNotes = notes.map((note, i) =>
            i === index ? { ...note, favorite: !note.favorite } : note
        );
        setNotes(updatedNotes);
    };

    // Filter Notes (Search, Archived, etc.)
    const filteredNotes = notes.filter(
        (note) =>
            (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.body.toLowerCase().includes(searchQuery.toLowerCase())) &&
            !note.archived
    );

    const archivedNotesList = notes.filter((note) => note.archived);
    const pinnedNotesList = notes.filter((note) => note.pinned && !note.archived);
    const favoriteNotesList = notes.filter((note) => note.favorite && !note.archived);

    return (
        <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
            <div className="max-w-3xl mx-auto p-4">
                {/* Dark Mode Toggle */}
                <button onClick={toggleDarkMode} className="mb-4 p-2 rounded bg-blue-500 text-white">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

                {/* New Note Form */}
                <div className="mb-4">
                    <input
                        className="border p-2 w-full rounded-lg mb-2"
                        type="text"
                        placeholder="Note Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />
                    <textarea
                        className="border p-2 w-full rounded-lg mb-2"
                        rows="4"
                        placeholder="Note Body"
                        value={newNote.body}
                        onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
                    ></textarea>
                    <button onClick={saveNote} className="bg-green-500 text-white px-4 py-2 rounded">
                        {isEditing !== null ? "Save Changes" : "Add Note"}
                    </button>
                </div>

                {/* Search Bar */}
                <input
                    className="border p-2 w-full mb-4 rounded-lg"
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Pinned Notes */}
                {pinnedNotesList.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Pinned Notes</h2>
                        {pinnedNotesList.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                index={notes.indexOf(note)}
                                editNote={editNote}
                                deleteNote={deleteNote}
                                archiveNote={archiveNote}
                                togglePinNote={togglePinNote}
                                toggleFavoriteNote={toggleFavoriteNote}
                            />
                        ))}
                    </div>
                )}

                {/* Favorite Notes */}
                {favoriteNotesList.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Favorite Notes</h2>
                        {favoriteNotesList.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                index={notes.indexOf(note)}
                                editNote={editNote}
                                deleteNote={deleteNote}
                                archiveNote={archiveNote}
                                togglePinNote={togglePinNote}
                                toggleFavoriteNote={toggleFavoriteNote}
                            />
                        ))}
                    </div>
                )}

                {/* Regular Notes */}
                <div>
                    <h2 className="text-xl font-bold mb-2">All Notes</h2>
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                index={notes.indexOf(note)}
                                editNote={editNote}
                                deleteNote={deleteNote}
                                archiveNote={archiveNote}
                                togglePinNote={togglePinNote}
                                toggleFavoriteNote={toggleFavoriteNote}
                            />
                        ))
                    ) : (
                        <p>No notes found</p>
                    )}
                </div>

                {/* Archived Notes Section */}
                {archivedNotesList.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Archived Notes</h2>
                        {archivedNotesList.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                index={notes.indexOf(note)}
                                editNote={editNote}
                                deleteNote={deleteNote}
                                archiveNote={archiveNote} // Unarchive by toggling archive state
                                togglePinNote={togglePinNote}
                                toggleFavoriteNote={toggleFavoriteNote}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// NoteCard Component
const NoteCard = ({
    note,
    index,
    editNote,
    deleteNote,
    archiveNote,
    togglePinNote,
    toggleFavoriteNote,
}) => (
    <Card className="mb-4 border p-4 shadow-sm">
        <CardHeader>
            <CardTitle>{note.title}</CardTitle>
            <CardDescription>{note.body}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-start sm:space-x-2">
                <button
                    onClick={() => editNote(index)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                    Edit
                </button>
                <button
                    onClick={() => deleteNote(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    Delete
                </button>
            </div>
            <div className="mt-2 sm:mt-0">
                <button
                    onClick={() => togglePinNote(index)}
                    className={`px-2 py-1 rounded ${note.pinned ? "bg-blue-500" : "bg-gray-300"}`}
                >
                    {note.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                    onClick={() => toggleFavoriteNote(index)}
                    className={`ml-2 px-2 py-1 rounded ${note.favorite ? "bg-yellow-400" : "bg-gray-300"}`}
                >
                    {note.favorite ? "Unfavorite" : "Favorite"}
                </button>
                <button
                    onClick={() => archiveNote(index)}
                    className="ml-2 bg-purple-500 text-white px-2 py-1 rounded"
                >
                    {note.archived ? "Unarchive" : "Archive"}
                </button>
            </div>
        </CardFooter>
    </Card>
);
