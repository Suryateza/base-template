import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  // State to track the current month, selected date, events list, modal state, and form data
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events') || '[]')); // Initialize from localStorage
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); // Modal state
  const [eventForm, setEventForm] = useState({ title: '', description: '', time: '' }); // Form data

  // Effect to save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Generate all the days in the current month to display in the calendar
  const startDay = startOfWeek(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: addDays(endOfMonth(currentMonth), 6 - endDay.getDay()) });

  // Function to handle a day click, opening the modal and resetting the form
  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsEventModalOpen(true);
    setEventForm({ title: '', description: '', time: '' });
  };

  // Function to add a new event and close the modal
  const handleAddEvent = () => {
    const newEvent = { ...eventForm, date: selectedDate };
    setEvents(prev => [...prev, newEvent]);
    setIsEventModalOpen(false); // Close modal after saving the event
  };

  // Function to delete an event by its index in the events array
  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index)); // Remove the event at the given index
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8 py-8">
      {/* Main calendar card */}
      <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-lg border border-gray-200">
        <CardHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
          <CardTitle className="text-2xl font-semibold">Event Calendar</CardTitle>
          <CardDescription className="text-gray-200">Navigate and manage your events effortlessly.</CardDescription>
        </CardHeader>

        {/* Calendar content */}
        <CardContent className="grid grid-cols-7 gap-3 text-center p-6 bg-gray-50 rounded-b-lg">
          {/* Display days of the week */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-gray-600 uppercase">{day}</div>
          ))}
          
          {/* Display each day in the calendar */}
          {days.map((day, dayIdx) => (
            <div
              key={dayIdx}
              onClick={() => handleDateClick(day)}
              className={`
                p-4 rounded-lg cursor-pointer transition-all duration-200
                ${!isSameDay(day, selectedDate) && 'hover:bg-blue-100 hover:scale-105'} 
                ${isSameDay(day, selectedDate) ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-white'}
                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : 'text-gray-800'}
              `}
            >
              {format(day, 'd')} {/* Show day number */}
              {events.some(event => isSameDay(event.date, day)) && <div className="mt-1 h-3 w-3 bg-red-500 rounded-full mx-auto"></div>}
              {/* Show a red dot if there are events on this day */}
            </div>
          ))}
        </CardContent>

        {/* Footer for calendar navigation buttons */}
        <CardFooter className="flex justify-between p-4 bg-gray-50 border-t">
          <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="bg-orange-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105">
            Previous
          </Button>
          <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="bg-green-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105">
            Next
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog for adding or editing events */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg border border-gray-200 transition-all duration-300">
          <DialogHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold">{format(selectedDate, 'PP')}</DialogTitle>
            <DialogDescription>Add or edit your event here.</DialogDescription>
          </DialogHeader>
          
          {/* Event form */}
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

          {/* Save button in modal footer */}
          <DialogFooter className="p-4 bg-gray-50 border-t rounded-b-lg">
            <Button type="submit" onClick={handleAddEvent} className="bg-red-500 hover:bg-blue-700 text-white shadow-md transition-transform transform hover:scale-105">
              Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Displaying events for the selected date */}
      <div className="mt-6 w-full max-w-2xl">
        {events.filter(event => isSameDay(event.date, selectedDate)).map((event, index) => (
          <Card key={index} className="mt-4 bg-white shadow-md border border-gray-200 rounded-lg transition-all hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <CardTitle className="text-lg font-semibold text-gray-800">{event.title}</CardTitle>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-gray-500 mt-1">{event.time}</p>
            </CardContent>

            {/* Delete button in event card */}
            <CardFooter className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg">
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