import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle,CardFooter,CardDescription, } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


//import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle,
//   Button,
//   Input,
//   Textarea,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter
// } from "@/components/ui";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events') || '[]'));
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', time: '' });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const startDay = startOfWeek(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: addDays(endOfMonth(currentMonth), 6 - endDay.getDay()) });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsEventModalOpen(true);
    setEventForm({ title: '', description: '', time: '' });
  };

  const handleAddEvent = () => {
    const newEvent = { ...eventForm, date: selectedDate };
    setEvents(prev => [...prev, newEvent]);
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
          <CardDescription>Navigate and manage your events.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold">{day}</div>
          ))}
          {days.map((day, dayIdx) => (
            <div 
              key={dayIdx} 
              onClick={() => handleDateClick(day)}
              className={`
                p-2 rounded cursor-pointer
                ${!isSameDay(day, selectedDate) && 'hover:bg-gray-200'}
                ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''}
                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : ''}
              `}
            >
              {format(day, 'd')}
              {events.some(event => isSameDay(event.date, day)) && <div className="mt-1 h-2 w-2 bg-red-500 rounded-full mx-auto"></div>}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Previous</Button>
          <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
        </CardFooter>
      </Card>

      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{format(selectedDate, 'PP')}</DialogTitle>
            <DialogDescription>Add or edit your event here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              value={eventForm.title} 
              onChange={(e) => setEventForm({...eventForm, title: e.target.value})} 
              placeholder="Event Title" 
            />
            <Textarea 
              value={eventForm.description} 
              onChange={(e) => setEventForm({...eventForm, description: e.target.value})} 
              placeholder="Event Description" 
            />
            <Input 
              type="time" 
              value={eventForm.time} 
              onChange={(e) => setEventForm({...eventForm, time: e.target.value})} 
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 w-full max-w-2xl">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, index) => (
          <Card key={index} className="mt-2">
            <CardContent>
              <CardTitle>{event.title}</CardTitle>
              <p>{event.description}</p>
              <p>{event.time}</p>
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

export default App;