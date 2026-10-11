import { randomUUID } from 'node:crypto';
import type { AppointmentRequest, AppointmentResponse, Doctor, Slot, Specialty } from '@nobat/shared';
import { DOCTORS, generateSlots } from './seed';

export type BookResult =
  | { ok: true; appointment: AppointmentResponse }
  | { ok: false; reason: 'DOCTOR_NOT_FOUND' | 'SLOT_NOT_FOUND' | 'SLOT_ALREADY_BOOKED' };

export class Store {
  private doctors = new Map<string, Doctor>();
  private slots = new Map<string, Slot>();
  private appointments = new Map<string, AppointmentResponse>();
  private appointmentBySlot = new Map<string, string>();

  constructor(doctors: Doctor[] = DOCTORS, slots: Slot[] = generateSlots(doctors)) {
    doctors.forEach((d) => this.doctors.set(d.id, d));
    slots.forEach((s) => this.slots.set(s.id, { ...s }));
  }

  listDoctors(specialty?: Specialty): Doctor[] {
    const all = [...this.doctors.values()];
    return specialty ? all.filter((d) => d.specialty === specialty) : all;
  }

  getDoctor(id: string): Doctor | undefined {
    return this.doctors.get(id);
  }

  listSlots(doctorId: string): Slot[] {
    return [...this.slots.values()]
      .filter((s) => s.doctorId === doctorId)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  allSlots(): Slot[] {
    return [...this.slots.values()];
  }

  getSlot(id: string): Slot | undefined {
    return this.slots.get(id);
  }

  /** Synchronous check-and-set => no double booking even with concurrent requests. */
  book(req: AppointmentRequest): BookResult {
    if (!this.doctors.has(req.doctorId)) return { ok: false, reason: 'DOCTOR_NOT_FOUND' };
    const slot = this.slots.get(req.slotId);
    if (!slot || slot.doctorId !== req.doctorId) return { ok: false, reason: 'SLOT_NOT_FOUND' };
    if (slot.isBooked) return { ok: false, reason: 'SLOT_ALREADY_BOOKED' };

    slot.isBooked = true;
    const appointment: AppointmentResponse = {
      id: randomUUID(),
      doctorId: slot.doctorId,
      slotId: slot.id,
      patientName: req.patientName,
      phone: req.phone,
      startsAt: slot.startsAt,
      createdAt: new Date().toISOString(),
    };
    this.appointments.set(appointment.id, appointment);
    this.appointmentBySlot.set(slot.id, appointment.id);
    return { ok: true, appointment };
  }

  /** Marks a slot booked without an appointment (used by the simulator). */
  markBooked(slotId: string): Slot | undefined {
    const slot = this.slots.get(slotId);
    if (!slot || slot.isBooked) return undefined;
    slot.isBooked = true;
    return slot;
  }

  /** Frees a slot (and its appointment, if any). */
  releaseSlot(slotId: string): Slot | undefined {
    const slot = this.slots.get(slotId);
    if (!slot || !slot.isBooked) return undefined;
    slot.isBooked = false;
    const apptId = this.appointmentBySlot.get(slotId);
    if (apptId) {
      this.appointments.delete(apptId);
      this.appointmentBySlot.delete(slotId);
    }
    return slot;
  }

  cancelAppointment(id: string): Slot | undefined {
    const appt = this.appointments.get(id);
    if (!appt) return undefined;
    return this.releaseSlot(appt.slotId);
  }

  hasAppointment(id: string): boolean {
    return this.appointments.has(id);
  }
}
