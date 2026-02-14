import { Link } from 'react-router';
import { Calendar, Users, Shield, Clock } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-slate-900 mb-4">Schedule Your Bank Appointment</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Book a convenient time to meet with our banking specialists. Whether you need to open an account, 
          discuss loans, or get financial advice, we're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#e6f4ed' }}>
            <Calendar className="w-6 h-6" style={{ color: '#008c50' }} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Flexible Scheduling</h3>
          <p className="text-sm text-slate-600">
            Choose a date and time that works best for your schedule, with appointments available throughout the week.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#e6f4ed' }}>
            <Users className="w-6 h-6" style={{ color: '#008c50' }} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Expert Advisors</h3>
          <p className="text-sm text-slate-600">
            Meet with experienced banking professionals who can help you with all your financial needs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#e6f4ed' }}>
            <Shield className="w-6 h-6" style={{ color: '#008c50' }} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Secure & Private</h3>
          <p className="text-sm text-slate-600">
            Your information is protected with bank-level security. We value your privacy and trust.
          </p>
        </div>
      </div>

      <div className="rounded-xl p-8 md:p-12 text-white text-center" style={{ background: 'linear-gradient(to bottom right, #008c50, #006b3d)' }}>
        <Calendar className="w-16 h-16 mx-auto mb-6 opacity-90" />
        <h2 className="text-white mb-4">Ready to Schedule?</h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: '#d4f1e3' }}>
          Start by selecting the service you need and choose a convenient time for your appointment.
        </p>
        <Link
          to="/book"
          className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-lg font-medium transition-colors"
          style={{ color: '#008c50' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f4ed'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <Clock className="w-5 h-5" />
          Book an Appointment
        </Link>
      </div>
    </div>
  );
}