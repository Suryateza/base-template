import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events') || '[]'));
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', time: '' });
  const [editingIndex, setEditingIndex] = useState(null); // Index of the event being edited

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const startDay = startOfWeek(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: addDays(endDay, 6 - endDay.getDay()) });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsEventModalOpen(true);
    setEventForm({ title: '', description: '', time: '' });
    setEditingIndex(null); // Reset editing index
  };

  const handleAddEvent = () => {
    const newEvent = { ...eventForm, date: selectedDate };
    if (editingIndex !== null) {
      // Update existing event
      const updatedEvents = events.map((event, index) => (index === editingIndex ? newEvent : event));
      setEvents(updatedEvents);
    } else {
      // Add new event
      setEvents(prev => [...prev, newEvent]);
    }
    setIsEventModalOpen(false);
  };

  const handleEditEvent = (index) => {
    const eventToEdit = events[index];
    setEventForm({ title: eventToEdit.title, description: eventToEdit.description, time: eventToEdit.time });
    setEditingIndex(index); // Set index of the event being edited
    setIsEventModalOpen(true); // Open the modal
  };

  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8 py-8">
      <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-lg border border-gray-200">
        <CardHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
          <CardTitle className="text-2xl font-semibold">Event Calendar</CardTitle>
          <CardDescription className="text-gray-200">Navigate and manage your events effortlessly.</CardDescription>
        </CardHeader>

        {/* Month Navigation */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="bg-orange-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105">
            Previous
          </Button>
          <span className="text-xl font-bold text-gray-700">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="bg-green-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105">
            Next
          </Button>
        </div>

        <CardContent className="grid grid-cols-7 gap-3 text-center p-6 bg-gray-50 rounded-b-lg">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-gray-600 uppercase">{day}</div>
          ))}
          {days.map((day, dayIdx) => (
            <div
              key={dayIdx}
              onClick={() => handleDateClick(day)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                ${!isSameDay(day, selectedDate) && 'hover:bg-blue-100 hover:scale-105'}
                ${isSameDay(day, selectedDate) ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-white'}
                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : 'text-gray-800'}
              `}
            >
              {format(day, 'd')}
              {events.some(event => isSameDay(event.date, day)) && <div className="mt-1 h-3 w-3 bg-red-500 rounded-full mx-auto"></div>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg border border-gray-200 transition-all duration-300">
          <DialogHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold">{format(selectedDate, 'PP')}</DialogTitle>
            <DialogDescription className ="text-red">{editingIndex !== null ? 'Edit your event here.' : 'Add a new event here.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-6">
            <Input
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              placeholder="Event Title"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:border-blue-500 shadow-sm"
            />
            <Textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              placeholder="Event Description"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:border-blue-500 shadow-sm"
            />
            <Input
              type="time"
              value={eventForm.time}
              onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:border-blue-500 shadow-sm"
            />
          </div>
          <DialogFooter className="p-4 bg-gray-50 border-t rounded-b-lg">
            <Button type="submit" onClick={handleAddEvent} className="bg-red-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105">
              {editingIndex !== null ? 'Update Event' : 'Save Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 w-full max-w-2xl">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, index) => (
          <Card key={index} className="mt-4 bg-white shadow-md border border-gray-200 rounded-lg transition-all hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <CardTitle className="text-lg font-semibold text-gray-800">{event.title}</CardTitle>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-gray-500 mt-1">{event.time}</p>
            </CardContent>
            <CardFooter className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg">
              <Button onClick={() => handleEditEvent(index)} className="bg-blue-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105 mr-2">
                Edit
              </Button>
              <Button onClick={() => handleDeleteEvent(index)} variant="destructive" className="bg-red-500 hover:bg-red-700 text-white shadow-md transition-transform transform hover:scale-105">
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
