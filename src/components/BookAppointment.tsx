import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { getTopics, getBranches, getAvailableSlots, createAppointment, Topic, Branch } from '../lib/appointmentStore';
import { Calendar } from './Calendar';

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    topicId: null as number | null,
    topicName: '',
    branchId: null as number | null,
    branchName: '',
    branchAddress: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    getTopics().then(setTopics);
  }, []);

  useEffect(() => {
    if (formData.topicId == null) return;
    setLoadingBranches(true);
    getBranches(formData.topicId)
      .then(setBranches)
      .finally(() => setLoadingBranches(false));
  }, [formData.topicId]);

  useEffect(() => {
    if (formData.branchId == null || !formData.date) return;
    setLoadingSlots(true);
    getAvailableSlots(formData.branchId, formData.date)
      .then(setAvailableSlots)
      .finally(() => setLoadingSlots(false));
  }, [formData.branchId, formData.date]);

  const selectTopic = (topic: Topic) => {
    setFormData(prev => ({
      ...prev,
      topicId: topic.id,
      topicName: topic.name,
      branchId: null,
      branchName: '',
      branchAddress: '',
    }));
  };

  const selectBranch = (branch: Branch) => {
    setFormData(prev => ({
      ...prev,
      branchId: branch.id,
      branchName: branch.name,
      branchAddress: branch.address,
    }));
  };

  const selectDate = (date: string) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
    setShowCalendar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppointment({
      topicId: formData.topicId!,
      branchId: formData.branchId!,
      date: formData.date,
      time: formData.time,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes || undefined,
    });
    navigate('/confirmation');
  };

  const canProceedStep1 = formData.topicId != null && formData.branchId != null;
  const canProceedStep2 = !!formData.date && !!formData.time;
  const canSubmit = !!formData.firstName && !!formData.lastName && !!formData.email && !!formData.phone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Book Your Appointment</h1>
        <p className="text-slate-600">Complete the form below to schedule your visit</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s, i) => (
            <>
              <div key={s} className={`flex items-center gap-2 ${step >= s ? '' : 'text-slate-400'}`} style={step >= s ? { color: '#008c50' } : {}}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'text-white' : 'bg-slate-200 text-slate-500'}`}
                  style={step >= s ? { backgroundColor: '#008c50' } : {}}
                >
                  {s}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {s === 1 ? 'Service' : s === 2 ? 'Date & Time' : 'Your Info'}
                </span>
              </div>
              {i < 2 && (
                <div key={`sep-${s}`} className="w-12 h-0.5" style={step > s ? { backgroundColor: '#008c50' } : { backgroundColor: '#e2e8f0' }} />
              )}
            </>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">

        {/* Step 1: Topic + Branch */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <CalendarIcon className="w-4 h-4" />
                What can we help you with?
              </label>
              {topics.length === 0 ? (
                <p className="text-sm text-slate-400">Loading services...</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {topics.map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => selectTopic(topic)}
                      className="p-4 rounded-lg border-2 text-left transition-all"
                      style={formData.topicId === topic.id
                        ? { borderColor: '#008c50', backgroundColor: '#e6f4ed' }
                        : { borderColor: '#e2e8f0' }}
                    >
                      <div className="font-medium text-slate-900">{topic.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {formData.topicId != null && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <MapPin className="w-4 h-4" />
                  Which location works best for you?
                </label>
                {loadingBranches ? (
                  <p className="text-sm text-slate-400">Loading branches...</p>
                ) : branches.length === 0 ? (
                  <p className="text-sm text-slate-500">No branches available for this service.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {branches.map(branch => (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => selectBranch(branch)}
                        className="p-4 rounded-lg border-2 text-left transition-all"
                        style={formData.branchId === branch.id
                          ? { borderColor: '#008c50', backgroundColor: '#e6f4ed' }
                          : { borderColor: '#e2e8f0' }}
                      >
                        <div className="font-medium text-slate-900">{branch.name}</div>
                        <div className="text-sm text-slate-500 mt-1">{branch.address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              style={canProceedStep1 ? { backgroundColor: '#008c50' } : {}}
              onMouseEnter={(e) => { if (canProceedStep1) e.currentTarget.style.backgroundColor = '#006b3d'; }}
              onMouseLeave={(e) => { if (canProceedStep1) e.currentTarget.style.backgroundColor = '#008c50'; }}
            >
              Continue to Date & Time
            </button>
          </div>
        )}

        {/* Step 2: Date & Time */}
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
                  readOnly
                  placeholder="Select a date"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none cursor-pointer"
                  onClick={() => setShowCalendar(!showCalendar)}
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
                      onSelectDate={selectDate}
                      minDate={(() => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`; })()}
                    />
                  </div>
                )}
              </div>
            </div>

            {formData.date && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <Clock className="w-4 h-4" />
                  Select Time
                </label>
                {loadingSlots ? (
                  <p className="text-sm text-slate-400">Loading available times...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-slate-500">No available slots for this date. Please choose another day.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                        className="py-2 px-3 rounded-lg border text-sm transition-all"
                        style={formData.time === slot
                          ? { borderColor: '#008c50', backgroundColor: '#008c50', color: 'white' }
                          : { borderColor: '#e2e8f0' }}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                onMouseEnter={(e) => { if (canProceedStep2) e.currentTarget.style.backgroundColor = '#006b3d'; }}
                onMouseLeave={(e) => { if (canProceedStep2) e.currentTarget.style.backgroundColor = '#008c50'; }}
              >
                Continue to Your Info
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: '#e6f4ed' }}>
              <div className="font-medium text-slate-800 mb-1">Appointment Summary</div>
              <div className="text-slate-600">{formData.topicName} · {formData.branchName}</div>
              <div className="text-slate-600">
                {new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {formatTime(formData.time)}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Smith"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
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
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.smith@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
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
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
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
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any specific questions or information we should know about?"
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
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
                onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = '#006b3d'; }}
                onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = '#008c50'; }}
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
