// App.jsx
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, isSameDay, parse } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', time: '' });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowEventModal(true);
    setFormData({ title: '', description: '', time: '' });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const eventForDate = events[selectedDate.toDateString()] || [];
    setEvents({
      ...events,
      [selectedDate.toDateString()]: [...eventForDate, formData]
    });
    setShowEventModal(false);
  };

  const removeEvent = (index) => {
    const updatedEvents = { ...events };
    updatedEvents[selectedDate.toDateString()].splice(index, 1);
    setEvents(updatedEvents);
  };

  const Month = ({ month }) => {
    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
          <div key={day} className="text-center text-xs font-semibold">{day}</div>
        )}
        {Array.from({ length: 42 }).map((_, index) => {
          const date = addDays(startOfWeek(month), index);
          const isCurrentMonth = date.getMonth() === month.getMonth();
          const isToday = isSameDay(date, new Date());
          const hasEvent = events[date.toDateString()] && events[date.toDateString()].length > 0;

          return (
            <div 
              key={index} 
              onClick={() => handleDateClick(date)}
              className={`p-2 text-center rounded cursor-pointer 
                ${!isCurrentMonth ? 'text-gray-400' : ''}
                ${isToday ? 'bg-blue-500 text-white' : ''}
                ${hasEvent ? 'bg-green-100' : ''}`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Previous</Button>
            <span className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
          </div>
          <Month month={currentMonth} />
        </CardContent>
      </Card>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Event</CardTitle>
            </CardHeader>
            <form onSubmit={handleEventSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Event</Button>
                <Button variant="destructive" onClick={() => setShowEventModal(false)}>Cancel</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {events[selectedDate.toDateString()] && events[selectedDate.toDateString()].map((event, index) => (
        <Card key={index} className="mt-4">
          <CardContent>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
            <p>{event.time}</p>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={() => removeEvent(index)}>Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default App;