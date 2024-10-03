import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem('events') || '[]'));
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', description: '', date: '' });

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const days = eachDayOfInterval({
    start: startOfWeek(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setCurrentEvent({ title: '', description: '', date: day });
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = () => {
    const updatedEvents = events.some(e => isSameDay(e.date, currentEvent.date)) 
      ? events.map(e => isSameDay(e.date, currentEvent.date) ? { ...e, ...currentEvent } : e)
      : [...events, currentEvent];
    setEvents(updatedEvents);
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (date) => {
    setEvents(events.filter(e => !isSameDay(e.date, date)));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle>Event Calendar</CardTitle>
        </CardHeader>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Prev</Button>
            <span className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => 
              <div key={day} className="text-center font-semibold text-gray-600">{day}</div>
            )}
            {days.map((day, idx) => {
              const isCurrentDay = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const hasEvent = events.some(event => isSameDay(event.date, day));
              
              return (
                <div 
                  key={idx} 
                  onClick={() => handleDateClick(day)}
                  className={`p-2 text-center rounded cursor-pointer 
                    ${isCurrentDay ? 'bg-green-200' : ''}
                    ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
                    ${hasEvent ? 'border-2 border-red-500' : ''}`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{format(currentEvent.date, 'PP')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              value={currentEvent.title} 
              onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} 
              placeholder="Event Title" 
            />
            <Textarea 
              value={currentEvent.description} 
              onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} 
              placeholder="Event Description" 
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEventSubmit}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-5 w-full max-w-4xl">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, idx) => (
          <Card key={idx} className="mb-4">
            <CardContent>
              <CardTitle>{event.title}</CardTitle>
              <p>{event.description}</p>
              <Button variant="destructive" onClick={() => handleDeleteEvent(event.date)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;