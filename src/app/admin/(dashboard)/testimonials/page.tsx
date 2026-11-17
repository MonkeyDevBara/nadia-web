import type { Metadata } from "next";
import { testimonialFields } from "@/components/admin/fieldConfigs";
import ListPage from "@/components/admin/ListPage";
import { deleteTestimonial, moveTestimonial, saveTestimonial } from "@/lib/actions/testimonials";

export const metadata: Metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  return (
    <ListPage
      title="Testimonials"
      description="Testimoni klien. Jika belum ada yang tampil, section testimonial otomatis disembunyikan."
      table="testimonials"
      noun="testimoni"
      titleKey="name"
      subtitleKey="position"
      fields={testimonialFields}
      defaults={{ quote: "", name: "", position: "", photo_url: null, is_visible: true }}
      save={saveTestimonial}
      remove={deleteTestimonial}
      move={moveTestimonial}
    />
  );
}
