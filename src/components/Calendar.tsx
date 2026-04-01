import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDate?: string;
}

export function Calendar({ selectedDate, onSelectDate, minDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const min = new Date(minDate);
    return date < min;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const selected = new Date(selectedDate);
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  };

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    onSelectDate(dateString);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(day);
    const selected = isDateSelected(day);
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(day)}
        disabled={disabled}
        className={`aspect-square rounded-md text-xs font-medium transition-all ${
          disabled
            ? 'text-slate-300 cursor-not-allowed'
            : selected
            ? 'text-white'
            : 'text-slate-900 hover:bg-slate-100'
        }`}
        style={selected ? { backgroundColor: '#008c50' } : {}}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-lg w-64">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={previousMonth}
          className="p-0.5 hover:bg-slate-100 rounded transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <div className="text-xs font-medium text-slate-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-0.5 hover:bg-slate-100 rounded transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-medium text-slate-500 py-0.5">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days}
      </div>
    </div>
  );
}