import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { appointmentStore } from '../lib/appointmentStore';
import { Calendar } from './Calendar';

const services = [
  { id: 'account', name: 'Open New Account', duration: '30 min' },
  { id: 'loan', name: 'Loan Consultation', duration: '45 min' },
  { id: 'mortgage', name: 'Mortgage Discussion', duration: '60 min' },
  { id: 'investment', name: 'Investment Planning', duration: '45 min' },
  { id: 'business', name: 'Business Banking', duration: '60 min' },
  { id: 'general', name: 'General Inquiry', duration: '15 min' },
];

const branches = [
  'Downtown Branch - 123 Main St',
  'Westside Branch - 456 Oak Ave',
  'Northgate Branch - 789 Pine Rd',
  'Southpark Branch - 321 Elm St',
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
];

export function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    branch: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appointmentStore.addAppointment({
      service: formData.service,
      branch: formData.branch,
      date: formData.date,
      time: formData.time,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    });
    navigate('/confirmation');
  };

  const canProceedStep1 = formData.service && formData.branch;
  const canProceedStep2 = formData.date && formData.time;
  const canSubmit = formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Book Your Appointment</h1>
        <p className="text-slate-600">Complete the form below to schedule your visit</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? '' : 'text-slate-400'}`} style={step >= 1 ? { color: '#008c50' } : {}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'text-white' : 'bg-slate-200 text-slate-500'
            }`} style={step >= 1 ? { backgroundColor: '#008c50' } : {}}>
              1
            </div>
            <span className="hidden sm:inline text-sm font-medium">Service</span>
          </div>
          
          <div className={`w-12 h-0.5 ${step >= 2 ? '' : 'bg-slate-200'}`} style={step >= 2 ? { backgroundColor: '#008c50' } : {}} />
          
          <div className={`flex items-center gap-2 ${step >= 2 ? '' : 'text-slate-400'}`} style={step >= 2 ? { color: '#008c50' } : {}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'text-white' : 'bg-slate-200 text-slate-500'
            }`} style={step >= 2 ? { backgroundColor: '#008c50' } : {}}>
              2
            </div>
            <span className="hidden sm:inline text-sm font-medium">Date & Time</span>
          </div>
          
          <div className={`w-12 h-0.5 ${step >= 3 ? '' : 'bg-slate-200'}`} style={step >= 3 ? { backgroundColor: '#008c50' } : {}} />
          
          <div className={`flex items-center gap-2 ${step >= 3 ? '' : 'text-slate-400'}`} style={step >= 3 ? { color: '#008c50' } : {}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'text-white' : 'bg-slate-200 text-slate-500'
            }`} style={step >= 3 ? { backgroundColor: '#008c50' } : {}}>
              3
            </div>
            <span className="hidden sm:inline text-sm font-medium">Your Info</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <CalendarIcon className="w-4 h-4" />
                Select Service
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => updateField('service', service.name)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.service === service.name
                        ? ''
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={formData.service === service.name ? { borderColor: '#008c50', backgroundColor: '#e6f4ed' } : {}}
                  >
                    <div className="font-medium text-slate-900">{service.name}</div>
                    <div className="text-sm text-slate-500 mt-1">{service.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <MapPin className="w-4 h-4" />
                Select Branch
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {branches.map(branch => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => updateField('branch', branch)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.branch === branch
                        ? ''
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={formData.branch === branch ? { borderColor: '#008c50', backgroundColor: '#e6f4ed' } : {}}
                  >
                    <div className="text-sm text-slate-900">{branch}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              style={canProceedStep1 ? { backgroundColor: '#008c50' } : {}}
              onMouseEnter={(e) => {
                if (canProceedStep1) e.currentTarget.style.backgroundColor = '#006b3d';
              }}
              onMouseLeave={(e) => {
                if (canProceedStep1) e.currentTarget.style.backgroundColor = '#008c50';
              }}
            >
              Continue to Date & Time
            </button>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <CalendarIcon className="w-4 h-4" />
                Select Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  placeholder="Select a date"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#008c50' } as React.CSSProperties}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="absolute top-0 right-0 h-full px-4 text-slate-500 hover:text-slate-700"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-1 z-10">
                    <Calendar
                      selectedDate={formData.date}
                      onSelectDate={(date) => {
                        updateField('date', date);
                        setShowCalendar(false);
                      }}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <Clock className="w-4 h-4" />
                Select Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateField('time', time)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      formData.time === time
                        ? 'text-white'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={formData.time === time ? { borderColor: '#008c50', backgroundColor: '#008c50' } : {}}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                style={canProceedStep2 ? { backgroundColor: '#008c50' } : {}}
                onMouseEnter={(e) => {
                  if (canProceedStep2) e.currentTarget.style.backgroundColor = '#006b3d';
                }}
                onMouseLeave={(e) => {
                  if (canProceedStep2) e.currentTarget.style.backgroundColor = '#008c50';
                }}
              >
                Continue to Your Info
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#008c50' } as React.CSSProperties}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Smith"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#008c50' } as React.CSSProperties}
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john.smith@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#008c50' } as React.CSSProperties}
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#008c50' } as React.CSSProperties}
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <FileText className="w-4 h-4" />
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Any specific questions or information we should know about?"
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
                style={{ '--tw-ring-color': '#008c50' } as React.CSSProperties}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                style={canSubmit ? { backgroundColor: '#008c50' } : {}}
                onMouseEnter={(e) => {
                  if (canSubmit) e.currentTarget.style.backgroundColor = '#006b3d';
                }}
                onMouseLeave={(e) => {
                  if (canSubmit) e.currentTarget.style.backgroundColor = '#008c50';
                }}
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}