import { Link } from 'react-router';
import { CheckCircle, Calendar, Home } from 'lucide-react';

export function Confirmation() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e6f4ed' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#008c50' }} />
        </div>

        <h1 className="text-slate-900 mb-4">Appointment Confirmed!</h1>
        
        <p className="text-lg text-slate-600 mb-8">
          Thank you for scheduling your appointment with Commerce Bank. 
          You will receive a confirmation email shortly with all the details.
        </p>

        <div className="rounded-lg p-6 mb-8 text-left" style={{ backgroundColor: '#e6f4ed', borderColor: '#008c50', borderWidth: '1px' }}>
          <h3 className="font-semibold text-slate-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span style={{ color: '#008c50' }} className="mt-0.5">•</span>
              <span>Check your email for confirmation and appointment details</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#008c50' }} className="mt-0.5">•</span>
              <span>Add the appointment to your calendar</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#008c50' }} className="mt-0.5">•</span>
              <span>Bring a valid ID and any relevant documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#008c50' }} className="mt-0.5">•</span>
              <span>Arrive 5-10 minutes early for check-in</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/appointments"
            className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#008c50' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006b3d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#008c50'}
          >
            <Calendar className="w-4 h-4" />
            View My Appointments
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}