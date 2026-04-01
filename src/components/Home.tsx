import { Link } from 'react-router';
import { Calendar, Clock } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl p-8 md:p-12 text-white text-center mb-12" style={{ background: 'linear-gradient(to bottom right, #008c50, #006b3d)' }}>
          <Calendar className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-white mb-4">Schedule Your Bank Appointment</h1>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: '#d4f1e3' }}>
            Book a convenient time to meet with our banking specialists. Whether you need to open an account, 
            discuss loans, or get financial advice, we're here to help.
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
    </div>
  );
}