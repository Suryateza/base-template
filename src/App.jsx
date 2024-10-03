import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', time: '' });

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(savedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const startDay = startOfWeek(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: endDay });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setIsOpen(true);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = { ...formData, date: selectedDate };
    setEvents([...events, newEvent]);
    setIsOpen(false);
    setFormData({ title: '', description: '', time: '' });
  };

  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <Card className="w-full max-w-lg shadow-xl rounded-lg border border-gray-200">
        <CardHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Event Calendar</CardTitle>
        </CardHeader>
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <Button onClick={prevMonth} className="bg-blue-600 text-white hover:bg-blue-700">Prev</Button>
            <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
            <Button onClick={nextMonth} className="bg-blue-600 text-white hover:bg-blue-700">Next</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 p-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600">{day}</div>
          ))}
          {days.map(day => (
            <div 
              key={day.toString()} 
              onClick={() => handleDayClick(day)}
              className={`cursor-pointer text-center py-2 rounded-lg 
                ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'} 
                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : ''}`}
            >
              {format(day, 'd')}
              {events.some(event => isSameDay(event.date, day)) && <div className="mt-1 h-2 w-2 bg-red-500 rounded-full mx-auto"></div>}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Event on {format(selectedDate, 'PP')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEventSubmit}>
            <div className="grid gap-4 py-4">
              <Input 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                placeholder="Event Title" 
                required 
              />
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Event Description" 
              />
              <Input 
                type="time" 
                value={formData.time} 
                onChange={e => setFormData({ ...formData, time: e.target.value })} 
                required 
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-6 w-full max-w-lg">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, index) => (
          <Card key={index} className="mt-4">
            <CardContent>
              <CardTitle>{event.title}</CardTitle>
              <p>{event.description}</p>
              <small>{event.time}</small>
            </CardContent>
            <Button onClick={() => handleDeleteEvent(index)} className="mt-2 bg-red-500 text-white hover:bg-red-600">Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}