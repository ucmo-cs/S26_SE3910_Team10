// All data operations go through the Spring Boot REST API at /api/*.
// The Vite proxy (vite.config.ts) forwards /api/* to http://localhost:8080.

export interface Topic {
  id: number;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  topics: Topic[];
}

export interface Appointment {
  id: number;
  topic: Topic;
  branch: Branch;
  date: string;      // ISO date string, e.g. "2024-06-15"
  time: string;      // "HH:mm" format, e.g. "10:00"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'SCHEDULED' | 'CANCELLED';
  createdAt: string;
}

export interface AppointmentRequest {
  topicId: number;
  branchId: number;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export async function getTopics(): Promise<Topic[]> {
  const res = await fetch('/api/topics');
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

export async function getBranches(topicId?: number): Promise<Branch[]> {
  const url = topicId != null ? `/api/branches?topicId=${topicId}` : '/api/branches';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch branches');
  return res.json();
}

export async function getAvailableSlots(branchId: number, date: string): Promise<string[]> {
  const res = await fetch(`/api/appointments/available-slots?branchId=${branchId}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch available slots');
  return res.json();
}

export async function getAppointments(): Promise<Appointment[]> {
  const res = await fetch('/api/appointments');
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

export async function getAppointment(id: number): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch appointment ${id}`);
  return res.json();
}

export async function createAppointment(data: AppointmentRequest): Promise<Appointment> {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create appointment');
  return res.json();
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}/cancel`, { method: 'PATCH' });
  if (!res.ok) throw new Error(`Failed to cancel appointment ${id}`);
  return res.json();
}

export async function deleteAppointment(id: number): Promise<void> {
  const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete appointment ${id}`);
}
