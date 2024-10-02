import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState({});
  const [formData, setFormData] = useState({ title: '', description: '', time: '' });

  // Generate days for calendar
  const startDay = startOfWeek(currentMonth);
  const days = Array.from({ length: 42 }, (_, i) => 
    addDays(startDay, i)
  );

  // Handle month navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Event handling
  const openModal = (date) => {
    setSelectedDate(date);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({ title: '', description: '', time: '' });
  };

  const saveEvent = () => {
    const eventDate = format(selectedDate, 'yyyy-MM-dd');
    setEvents(prev => ({
      ...prev,
      [eventDate]: [...(prev[eventDate] || []), formData]
    }));
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-4xl p-4 shadow-xl">
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
        </CardHeader>
        <div className="flex justify-between items-center p-4">
          <Button onClick={prevMonth}>Prev</Button>
          <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button onClick={nextMonth}>Next</Button>
        </div>
        <CardContent className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
            <div key={day} className="text-center font-semibold">{day}</div>
          )}
          {days.map(day => (
            <div 
              key={day} 
              className={`p-2 text-center cursor-pointer rounded ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'} ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : ''}`}
              onClick={() => openModal(day)}
            >
              {day.getDate()}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDate ? format(selectedDate, 'PP') : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Event Title" className="mb-2" />
          <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="mb-2" />
          <Input type="time" name="time" value={formData.time} onChange={handleInputChange} className="mb-2" />
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={saveEvent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;