export interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branch: string;
  notes?: string;
  status: 'scheduled' | 'cancelled';
  createdAt: string;
}

class AppointmentStore {
  private appointments: Appointment[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Load appointments from localStorage
    const stored = localStorage.getItem('bank-appointments');
    if (stored) {
      this.appointments = JSON.parse(stored);
    }
  }

  private persist() {
    localStorage.setItem('bank-appointments', JSON.stringify(this.appointments));
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    this.appointments.push(newAppointment);
    this.persist();
    return newAppointment;
  }

  getAppointments(): Appointment[] {
    return [...this.appointments];
  }

  getAppointment(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  cancelAppointment(id: string) {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = 'cancelled';
      this.persist();
    }
  }

  deleteAppointment(id: string) {
    this.appointments = this.appointments.filter(a => a.id !== id);
    this.persist();
  }
}

export const appointmentStore = new AppointmentStore();
