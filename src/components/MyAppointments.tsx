import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, MapPin, User, Mail, Phone, FileText, X } from 'lucide-react';
import { getAppointments, cancelAppointment, Appointment } from '../lib/appointmentStore';

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch all appointments from the backend on mount
  useEffect(() => {
    getAppointments().then(setAppointments);
  }, []);

  const handleCancel = async (id: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(id);
      // Re-fetch so the UI reflects the updated status from the DB
      getAppointments().then(setAppointments);
    }
  };

  const scheduledAppointments = appointments.filter(a => a.status === 'SCHEDULED');
  const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">My Appointments</h1>
        <p className="text-slate-600">View and manage your scheduled appointments</p>
      </div>

      {scheduledAppointments.length === 0 && cancelledAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 mb-2">No Appointments Yet</h3>
          <p className="text-slate-600 mb-6">You haven't scheduled any appointments. Let's get started!</p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#008c50' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006b3d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#008c50'}
          >
            <Calendar className="w-4 h-4" />
            Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Scheduled Appointments */}
          {scheduledAppointments.length > 0 && (
            <div>
              <h2 className="text-slate-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {scheduledAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#e6f4ed', color: '#006b3d' }}>
                          {appointment.topic.name}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.date + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.branch.name} — {appointment.branch.address}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium self-start"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span>{appointment.firstName} {appointment.lastName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{appointment.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="border-t border-slate-100 pt-4 mt-4">
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-700 mb-1">Notes</div>
                            <p className="text-slate-600">{appointment.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled Appointments */}
          {cancelledAppointments.length > 0 && (
            <div>
              <h2 className="text-slate-900 mb-4">Cancelled Appointments</h2>
              <div className="space-y-4">
                {cancelledAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-6 opacity-60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-block bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
                          {appointment.topic.name}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.date + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500 font-medium">Cancelled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}