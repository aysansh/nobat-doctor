import type { Broadcaster } from './hub';
import type { Store } from './store';
import { log } from './logger';

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(arr: T[]): T | undefined => arr[Math.floor(Math.random() * arr.length)];

/** Every 15–25s: usually book a random free slot, sometimes release a booked one. */
export function startSimulator(store: Store, hub: Broadcaster) {
  let timer: NodeJS.Timeout;

  const tick = () => {
    const slots = store.allSlots();
    if (Math.random() < 0.75) {
      const slot = pick(slots.filter((s) => !s.isBooked));
      if (slot && store.markBooked(slot.id)) {
        log.sim(`booked ${slot.id}`);
        hub.broadcast(slot.doctorId, { type: 'slot:booked', doctorId: slot.doctorId, slotId: slot.id });
      }
    } else {
      const slot = pick(slots.filter((s) => s.isBooked));
      if (slot && store.releaseSlot(slot.id)) {
        log.sim(`released ${slot.id}`);
        hub.broadcast(slot.doctorId, { type: 'slot:released', doctorId: slot.doctorId, slotId: slot.id });
      }
    }
    schedule();
  };
  const schedule = () => {
    timer = setTimeout(tick, rand(15_000, 25_000));
  };

  schedule();
  log.sim('simulator started (event every 15–25s)');
  return () => clearTimeout(timer);
}
