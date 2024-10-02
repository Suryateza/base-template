import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
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
  const days = eachDayOfInterval({ start: startDay, end: addDays(endDay, 6 - endDay.getDay()) });

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle>Event Calendar</CardTitle>
          <CardDescription>Navigate and manage your events.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Previous</Button>
            <div>{format(currentMonth, 'MMMM yyyy')}</div>
            <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
              <div key={day} className="font-bold text-center">{day}</div>
            )}
            {days.map((day, dayIdx) => (
              <div 
                key={dayIdx} 
                onClick={() => handleDateClick(day)} 
                className={`cursor-pointer text-center p-2 rounded-full 
                  ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : 
                    day.getMonth() === currentMonth.getMonth() ? 'hover:bg-gray-200' : 'text-gray-400'}
                `}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              value={eventForm.title} 
              onChange={e => setEventForm({...eventForm, title: e.target.value})} 
              placeholder="Event Title" 
            />
            <Textarea 
              value={eventForm.description} 
              onChange={e => setEventForm({...eventForm, description: e.target.value})} 
              placeholder="Description" 
            />
            <Input 
              type="time" 
              value={eventForm.time} 
              onChange={e => setEventForm({...eventForm, time: e.target.value})} 
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 w-full max-w-2xl">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, index) => (
          <Card key={index} className="mt-4">
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