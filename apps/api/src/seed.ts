import type { Doctor, Slot } from '@nobat/shared';

const TEHRAN_OFFSET_MIN = 210; // UTC+03:30, no DST since 2022

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'دکتر علی رضایی',
    specialty: 'قلب',
    city: 'تهران',
    bio: 'فوق‌تخصص قلب و عروق با ۱۵ سال سابقه در بیمارستان‌های تهران.',
    rating: 4.8,
    avatarUrl: 'https://i.pravatar.cc/256?img=12',
  },
  {
    id: 'd2',
    name: 'دکتر مریم احمدی',
    specialty: 'پوست',
    city: 'تهران',
    bio: 'متخصص پوست، مو و زیبایی؛ تمرکز بر درمان آکنه و لیزر.',
    rating: 4.6,
    avatarUrl: 'https://i.pravatar.cc/256?img=47',
  },
  {
    id: 'd3',
    name: 'دکتر سارا کریمی',
    specialty: 'اطفال',
    city: 'اصفهان',
    bio: 'متخصص کودکان و نوزادان، مشاوره تغذیه و رشد.',
    rating: 4.9,
    avatarUrl: 'https://i.pravatar.cc/256?img=45',
  },
  {
    id: 'd4',
    name: 'دکتر حسین موسوی',
    specialty: 'عمومی',
    city: 'شیراز',
    bio: 'پزشک عمومی با تجربه در طب خانواده و پیشگیری.',
    rating: 4.3,
    avatarUrl: 'https://i.pravatar.cc/256?img=33',
  },
  {
    id: 'd5',
    name: 'دکتر نیلوفر صادقی',
    specialty: 'قلب',
    city: 'مشهد',
    bio: 'متخصص قلب و عروق، فلوشیپ اکوکاردیوگرافی.',
    rating: 4.7,
    avatarUrl: 'https://i.pravatar.cc/256?img=49',
  },
  {
    id: 'd6',
    name: 'دکتر امیر نوری',
    specialty: 'پوست',
    city: 'تبریز',
    bio: 'متخصص بیماری‌های پوست و مو، جراحی‌های کوچک پوستی.',
    rating: 4.4,
    avatarUrl: 'https://i.pravatar.cc/256?img=15',
  },
  {
    id: 'd7',
    name: 'دکتر زهرا حسینی',
    specialty: 'اطفال',
    city: 'تهران',
    bio: 'متخصص اطفال، واکسیناسیون و پیگیری رشد کودک.',
    rating: 4.5,
    avatarUrl: 'https://i.pravatar.cc/256?img=44',
  },
  {
    id: 'd8',
    name: 'دکتر رضا فرهادی',
    specialty: 'عمومی',
    city: 'تهران',
    bio: 'پزشک عمومی، ویزیت و مشاوره سلامت عمومی.',
    rating: 4.1,
    avatarUrl: 'https://i.pravatar.cc/256?img=52',
  },
];

/** Tiny deterministic PRNG so the seed is stable between restarts. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Slots for the next 7 days (tomorrow..+7), 09:00–12:30 Tehran time, 30-min steps. */
export function generateSlots(doctors: Doctor[], now = new Date()): Slot[] {
  const rand = mulberry32(42);
  const slots: Slot[] = [];

  // "today" in Tehran, as a UTC-midnight date
  const tehranNow = new Date(now.getTime() + TEHRAN_OFFSET_MIN * 60_000);
  const todayUtcMidnight = Date.UTC(
    tehranNow.getUTCFullYear(),
    tehranNow.getUTCMonth(),
    tehranNow.getUTCDate(),
  );

  for (const doctor of doctors) {
    for (let day = 1; day <= 7; day++) {
      const dayStart = todayUtcMidnight + day * 86_400_000; // Tehran-local midnight, expressed as UTC fields
      const d = new Date(dayStart);
      const dateKey = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
      for (let minutes = 9 * 60; minutes < 13 * 60; minutes += 30) {
        const startsAtMs = dayStart + minutes * 60_000 - TEHRAN_OFFSET_MIN * 60_000;
        slots.push({
          id: `${doctor.id}-${dateKey}-${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}`,
          doctorId: doctor.id,
          startsAt: new Date(startsAtMs).toISOString(),
          isBooked: rand() < 0.3,
        });
      }
    }
  }
  return slots;
}
