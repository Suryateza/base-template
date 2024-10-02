import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', description: '', time: '' });

  // Load events from localStorage or initialize
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events') || '{}');
    setEvents(savedEvents);
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const days = eachDayOfInterval({
    start: startOfWeek(currentMonth),
    end: addDays(endOfMonth(currentMonth), 6 - endOfMonth(currentMonth).getDay()),
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentEvent({ date: date, title: '', description: '', time: '' });
    setIsOpen(true);
  };

  const handleEventSave = () => {
    const eventId = currentEvent.date.toISOString();
    setEvents({ ...events, [eventId]: currentEvent });
    setIsOpen(false);
  };

  const handleDeleteEvent = (date) => {
    const newEvents = { ...events };
    delete newEvents[date.toISOString()];
    setEvents(newEvents);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Event Calendar</CardTitle>
          <div>
            <Button variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&lt;</Button>
            <span className="mx-2">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&gt;</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => 
              <div key={day} className="font-bold">{day}</div>
            )}
            {days.map((day) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const hasEvent = events[day.toISOString()] !== undefined;
              return (
                <div 
                  key={day.toString()} 
                  onClick={() => handleDateSelect(day)} 
                  className={cn(
                    "p-2 cursor-pointer rounded",
                    isCurrentMonth ? "text-black" : "text-gray-400",
                    isSameDay(day, selectedDate) && "bg-blue-500 text-white",
                    hasEvent && "bg-yellow-100"
                  )}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{format(currentEvent.date, 'PP')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={currentEvent.title} onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })} placeholder="Event Title" />
            <Textarea value={currentEvent.description} onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })} placeholder="Description" />
            <Input type="time" value={currentEvent.time} onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={handleEventSave}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {events[selectedDate.toISOString()] && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{events[selectedDate.toISOString()].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{events[selectedDate.toISOString()].description}</p>
              <p>Time: {events[selectedDate.toISOString()].time}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => handleDeleteEvent(selectedDate)}>
                <TrashIcon className="mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;