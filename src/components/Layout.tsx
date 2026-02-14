import { Outlet, Link, useLocation } from 'react-router';
import { Calendar, Clock, Building2 } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="w-8 h-8" style={{ color: '#008c50' }} />
              <div>
                <div className="font-semibold text-slate-900">Commerce Bank</div>
                <div className="text-xs text-slate-500">Appointment Booking</div>
              </div>
            </Link>
            
            <nav className="flex gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 text-sm transition-colors ${
                  location.pathname === '/' 
                    ? 'font-medium' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={location.pathname === '/' ? { color: '#008c50' } : {}}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Book Appointment</span>
              </Link>
              <Link
                to="/appointments"
                className={`flex items-center gap-2 text-sm transition-colors ${
                  location.pathname === '/appointments' 
                    ? 'font-medium' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={location.pathname === '/appointments' ? { color: '#008c50' } : {}}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">My Appointments</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-slate-500 text-center">
            © 2026 Commerce Bank. All rights reserved. | Call us: 1-800-BANK-123
          </p>
        </div>
      </footer>
    </div>
  );
}