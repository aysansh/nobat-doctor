import express, { type ErrorRequestHandler, type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import {
  AppointmentRequestSchema,
  DoctorListQuerySchema,
  type ApiError,
  type AppointmentResponse,
} from '@nobat/shared';
import type { Store } from './store';
import type { Broadcaster } from './hub';
import { log } from './logger';

export interface AppDeps {
  store: Store;
  hub: Broadcaster;
  /** Artificial latency for POST /api/appointments (ms). */
  bookingDelayMs?: number;
  corsOrigin?: string | string[];
}

interface CachedResult {
  fingerprint: string;
  result: Promise<{ status: number; body: AppointmentResponse | ApiError }>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void> | void) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);

export function createApp({ store, hub, bookingDelayMs = 600, corsOrigin = 'http://localhost:3000' }: AppDeps) {
  const app = express();
  const idempotency = new Map<string, CachedResult>();

  app.disable('x-powered-by');
  app.use(cors({ origin: corsOrigin, allowedHeaders: ['Content-Type', 'Idempotency-Key'], methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
  app.use(express.json({ limit: '10kb' }));
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => log.http(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`));
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/doctors', (req, res) => {
    const parsed = DoctorListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const body: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'تخصص نامعتبر است',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return void res.status(400).json(body);
    }
    res.json(store.listDoctors(parsed.data.specialty));
  });

  app.get('/api/doctors/:id', (req, res) => {
    const doctor = store.getDoctor(req.params.id);
    if (!doctor) return void res.status(404).json({ code: 'NOT_FOUND', message: 'پزشک پیدا نشد' } satisfies ApiError);
    res.json(doctor);
  });

  app.get('/api/doctors/:id/slots', (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!store.getDoctor(req.params.id)) {
      return void res.status(404).json({ code: 'NOT_FOUND', message: 'پزشک پیدا نشد' } satisfies ApiError);
    }
    res.json(store.listSlots(req.params.id));
  });

  app.post(
    '/api/appointments',
    asyncHandler(async (req, res) => {
      res.set('Cache-Control', 'no-store');

      const parsed = AppointmentRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        const body: ApiError = {
          code: 'VALIDATION_ERROR',
          message: 'اطلاعات واردشده معتبر نیست',
          fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };
        return void res.status(400).json(body);
      }
      const input = parsed.data;

      const run = async (): Promise<{ status: number; body: AppointmentResponse | ApiError }> => {
        await sleep(bookingDelayMs);
        const result = store.book(input);
        if (result.ok) {
          const { appointment } = result;
          hub.broadcast(input.doctorId, { type: 'slot:booked', doctorId: input.doctorId, slotId: input.slotId });
          return { status: 201, body: appointment };
        }
        switch (result.reason) {
          case 'SLOT_ALREADY_BOOKED':
            return { status: 409, body: { code: 'SLOT_ALREADY_BOOKED', message: 'این نوبت قبلاً رزرو شده است' } };
          default:
            return { status: 404, body: { code: 'NOT_FOUND', message: 'پزشک یا نوبت پیدا نشد' } };
        }
      };

      const key = req.header('Idempotency-Key');
      if (!key) {
        const { status, body } = await run();
        return void res.status(status).json(body);
      }

      // Same key + same payload => replay the first result (even while it is still in flight).
      const fingerprint = JSON.stringify(input);
      const cached = idempotency.get(key);
      if (cached) {
        if (cached.fingerprint !== fingerprint) {
          return void res.status(422).json({
            code: 'VALIDATION_ERROR',
            message: 'این Idempotency-Key قبلاً با درخواست دیگری استفاده شده است',
          } satisfies ApiError);
        }
        const { status, body } = await cached.result;
        res.set('Idempotent-Replayed', 'true');
        return void res.status(status).json(body);
      }
      const entry: CachedResult = { fingerprint, result: run() };
      idempotency.set(key, entry);
      const { status, body } = await entry.result;
      res.status(status).json(body);
    }),
  );

  app.delete('/api/appointments/:id', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const slot = store.cancelAppointment(req.params.id);
    if (!slot) return void res.status(404).json({ code: 'NOT_FOUND', message: 'نوبت پیدا نشد' } satisfies ApiError);
    hub.broadcast(slot.doctorId, { type: 'slot:released', doctorId: slot.doctorId, slotId: slot.id });
    res.status(204).end();
  });

  app.use((_req, res) => {
    res.status(404).json({ code: 'NOT_FOUND', message: 'مسیر پیدا نشد' } satisfies ApiError);
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    const isBadJson = err instanceof SyntaxError && 'body' in err;
    if (isBadJson) {
      return void res.status(400).json({ code: 'VALIDATION_ERROR', message: 'JSON نامعتبر است' } satisfies ApiError);
    }
    log.http('unhandled error:', err);
    res.status(500).json({ code: 'INTERNAL', message: 'خطای داخلی سرور' } satisfies ApiError);
  };
  app.use(onError);

  return app;
}
