import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ date: '', title: '', description: '', time: '' });

  // Load events from localStorage or initialize an empty array
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDay = startOfWeek(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: addDays(endDay, 6 - endDay.getDay()) });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setCurrentEvent({ date: day, title: '', description: '', time: '' });
    setIsModalOpen(true);
  };

  const handleEventSubmit = () => {
    const updatedEvents = events.some(e => isSameDay(e.date, currentEvent.date)) 
      ? events.map(e => isSameDay(e.date, currentEvent.date) ? currentEvent : e)
      : [...events, currentEvent];
    setEvents(updatedEvents);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (date) => {
    setEvents(events.filter(e => !isSameDay(e.date, date)));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <Card className="w-full max-w-4xl p-4">
        <CardHeader>
          <CardTitle className="text-2xl">Event Calendar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-7 gap-2 text-center py-4">
          {daysOfWeek.map(day => <div key={day} className="font-semibold">{day}</div>)}
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`p-2 cursor-pointer rounded hover:bg-blue-100 
                ${isSameDay(day, new Date()) ? 'bg-green-200' : ''}
                ${isSameDay(day, selectedDate) ? 'bg-blue-200' : ''}
                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
              {events.some(event => isSameDay(event.date, day)) && <div className="mt-1 h-1 w-1 bg-red-500 rounded-full mx-auto"></div>}
            </div>
          ))}
        </CardContent>
        <div className="flex justify-between px-4">
          <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Previous</Button>
          <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{`Event for ${format(currentEvent.date, 'PP')}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={currentEvent.title} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} placeholder="Event Title" />
            <Textarea value={currentEvent.description} onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})} placeholder="Event Description" />
            <Input type="time" value={currentEvent.time} onChange={e => setCurrentEvent({...currentEvent, time: e.target.value})} />
          </div>
          <DialogFooter>
            <Button onClick={handleEventSubmit}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {events.filter(event => isSameDay(event.date, selectedDate)).map((event, idx) => (
        <Card key={idx} className="mt-4 w-full max-w-4xl">
          <CardContent>
            <CardTitle>{event.title}</CardTitle>
            <p>{event.description}</p>
            <p>{event.time}</p>
            <Button variant="destructive" onClick={() => handleDeleteEvent(event.date)}>Delete</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default App;