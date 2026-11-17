import { z } from "zod";

/** Form kontak publik: pesan error berbahasa Inggris karena tampil di website publik. */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120, "Name is too long"),
  email: z.email("Please enter a valid email").max(200, "Email is too long"),
  body: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
  /** Honeypot: harus kosong. Bot biasanya mengisi semua field. */
  website: z.string().max(0).optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
