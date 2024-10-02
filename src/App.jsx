import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events') || '[]'));
  const [isOpen, setIsOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', time: '' });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const startDay = startOfWeek(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: addDays(endDay, 6 - endDay.getDay()) });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setEventForm({ title: '', description: '', time: '' });
    setIsOpen(true);
  };

  const handleAddEvent = () => {
    const newEvent = { ...eventForm, date: selectedDate };
    setEvents([...events, newEvent]);
    setIsOpen(false);
  };

  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg p-4 bg-white shadow-lg rounded-lg">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold">Event Calendar</CardTitle>
          <CardDescription>Navigate through months and manage your events.</CardDescription>
        </CardHeader>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md">Previous</Button>
          <span className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md">Next</Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600">{day}</div>
          ))}
          {days.map((day, dayIdx) => (
            <div 
              key={dayIdx} 
              onClick={() => handleDateClick(day)}
              className={`cursor-pointer text-center p-2 rounded-lg 
                ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : 
                day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : 'hover:bg-gray-200'}
              `}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>Enter event details for {format(selectedDate, 'PP')}</DialogDescription>
          </DialogHeader>
          <Input 
            value={eventForm.title} 
            onChange={(e) => setEventForm({...eventForm, title: e.target.value})} 
            placeholder="Event Title" 
            className="mb-2"
          />
          <Textarea 
            value={eventForm.description} 
            onChange={(e) => setEventForm({...eventForm, description: e.target.value})} 
            placeholder="Event Description" 
            className="mb-2"
          />
          <Input 
            type="time" 
            value={eventForm.time} 
            onChange={(e) => setEventForm({...eventForm, time: e.target.value})} 
            className="mb-2"
          />
          <DialogFooter>
            <Button onClick={handleAddEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 w-full max-w-lg">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <CardTitle>{event.title}</CardTitle>
              <p>{event.description}</p>
              <small>{event.time}</small>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleDeleteEvent(index)} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}